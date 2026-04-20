import type { InteropDurationSplit, Project } from '@l2beat/config'
import type { InteropTransferTypeStatsMap } from '@l2beat/database'
import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import isEqual from 'lodash/isEqual'
import type {
  AverageDuration,
  CommonInteropData,
  UnknownAverageDuration,
} from '../types'

export function getAverageDuration(
  data: CommonInteropData,
  durationSplit: InteropDurationSplit | undefined,
): Exclude<AverageDuration, UnknownAverageDuration> | null {
  if (data.transfersWithDurationCount <= 0) return null

  if (
    durationSplit &&
    durationSplit.some((split) => split.transferTypes.length > 0)
  ) {
    return {
      type: 'split',
      splits: durationSplit.map((split) => ({
        label: split.label,
        duration: getSplitDuration(split.transferTypes, data.transferTypeStats),
      })),
    }
  }

  return {
    type: 'single',
    duration: Math.floor(
      data.totalDurationSum / data.transfersWithDurationCount,
    ),
  }
}

export function getDurationSplit(
  project: Project<'interopConfig'>,
  bridgeTypes: KnownInteropBridgeType[],
): InteropDurationSplit | undefined {
  const projectDurationSplits = project.interopConfig.durationSplit
  if (!projectDurationSplits) return undefined

  const bridgeTypeMap = new Map<
    KnownInteropBridgeType,
    NonNullable<InteropDurationSplit>
  >()

  for (const [bridgeType, durationSplit] of Object.entries(
    projectDurationSplits,
  )) {
    bridgeTypeMap.set(bridgeType as KnownInteropBridgeType, durationSplit)
  }

  const [firstBridgeType, ...restBridgeTypes] = bridgeTypes
  if (!firstBridgeType) return undefined

  const firstDurationSplit = bridgeTypeMap.get(firstBridgeType)
  if (!firstDurationSplit) return undefined

  const normalizedFirstDurationSplit =
    normalizeDurationSplit(firstDurationSplit)
  const hasSameDurationSplit = restBridgeTypes.every((bridgeType) => {
    const durationSplit = bridgeTypeMap.get(bridgeType)
    return durationSplit !== undefined
      ? isEqual(
          normalizedFirstDurationSplit,
          normalizeDurationSplit(durationSplit),
        )
      : false
  })

  return hasSameDurationSplit ? firstDurationSplit : undefined
}

function normalizeDurationSplit(
  durationSplit: InteropDurationSplit,
): InteropDurationSplit {
  return durationSplit
    .map((split) => ({
      label: split.label,
      transferTypes: [...split.transferTypes].sort(),
    }))
    .toSorted(
      (a, b) =>
        a.label.localeCompare(b.label) ||
        a.transferTypes.join(',').localeCompare(b.transferTypes.join(',')),
    )
}

function getSplitDuration(
  transferTypes: string[],
  transferTypeStats: InteropTransferTypeStatsMap | undefined,
): number | null {
  const matchedStats = [...new Set(transferTypes)]
    .map((transferType) => transferTypeStats?.[transferType])
    .filter((stats) => stats !== undefined)

  const transfersWithDurationCount = matchedStats.reduce(
    (acc, stats) => acc + stats.transferCount,
    0,
  )

  if (transfersWithDurationCount <= 0) return null

  const totalDurationSum = matchedStats.reduce(
    (acc, stats) => acc + stats.totalDurationSum,
    0,
  )

  return Math.floor(totalDurationSum / transfersWithDurationCount)
}
