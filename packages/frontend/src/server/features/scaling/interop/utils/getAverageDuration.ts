import type { InteropDurationSplit, Project } from '@l2beat/config'
import type { InteropTransferTypeStatsMap } from '@l2beat/database'
import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import isEqual from 'lodash/isEqual'
import type {
  AverageDuration,
  CommonInteropData,
  DurationSplitMap,
  UnknownAverageDuration,
} from '../types'

export function getAverageDuration(
  projectId: string,
  bridgeTypes: KnownInteropBridgeType[] | undefined,
  data: CommonInteropData,
  durationSplitMap: DurationSplitMap | undefined,
): Exclude<AverageDuration, UnknownAverageDuration> | null {
  const durationSplit = getDurationSplit(
    projectId,
    bridgeTypes,
    durationSplitMap,
  )

  if (data.transferCount <= 0) return null

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
    duration: Math.floor(data.totalDurationSum / data.transferCount),
  }
}

function getDurationSplit(
  projectId: string,
  bridgeTypes: KnownInteropBridgeType[] | undefined,
  durationSplitMap: DurationSplitMap | undefined,
): InteropDurationSplit | undefined {
  const [firstBridgeType, ...restBridgeTypes] = bridgeTypes ?? []
  if (!firstBridgeType) return undefined

  const projectDurationSplits = durationSplitMap?.get(projectId)
  const firstDurationSplit = projectDurationSplits?.get(firstBridgeType)
  if (!firstDurationSplit) return undefined

  const normalizedFirstDurationSplit =
    normalizeDurationSplit(firstDurationSplit)
  const hasSameDurationSplit = restBridgeTypes.every((bridgeType) => {
    const durationSplit = projectDurationSplits?.get(bridgeType)
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

  const transferCount = matchedStats.reduce(
    (acc, stats) => acc + stats.transferCount,
    0,
  )

  if (transferCount <= 0) return null

  const totalDurationSum = matchedStats.reduce(
    (acc, stats) => acc + stats.totalDurationSum,
    0,
  )

  return Math.floor(totalDurationSum / transferCount)
}

export function buildDurationSplitMap(
  interopProjects: Project<'interopConfig'>[],
): DurationSplitMap {
  const durationSplitMap: DurationSplitMap = new Map()

  for (const project of interopProjects) {
    const projectDurationSplits = project.interopConfig.durationSplit
    if (!projectDurationSplits) continue

    const bridgeTypeMap = new Map<
      KnownInteropBridgeType,
      NonNullable<InteropDurationSplit>
    >()

    for (const [bridgeType, durationSplit] of Object.entries(
      projectDurationSplits,
    )) {
      bridgeTypeMap.set(bridgeType as KnownInteropBridgeType, durationSplit)
    }

    durationSplitMap.set(project.id, bridgeTypeMap)
  }

  return durationSplitMap
}
