import type {
  InteropConfig,
  InteropDurationSplit,
  Project,
} from '@l2beat/config'
import type { InteropTransferTypeStatsMap } from '@l2beat/database'
import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import isEqual from 'lodash/isEqual'

export type CommonInteropData = {
  transfersWithDurationCount: number
  totalDurationSum: number
  transferTypeStats: InteropTransferTypeStatsMap | undefined
}

export type AverageTransferTime =
  | {
      type: 'single'
      duration: number
    }
  | {
      type: 'split'
      splits: {
        label: string
        duration: number | null
      }[]
    }
  | {
      type: 'unknown'
    }
  | null

export type ProjectMetadata = Pick<
  Project<'interopConfig'>,
  'id' | 'slug' | 'name'
> & {
  interopConfig: Project<'interopConfig'>['interopConfig']
}

export function getProtocolAverageTransferTime(
  protocol: CommonInteropData & {
    project: ProjectMetadata | undefined
  },
): AverageTransferTime {
  if (hasUnknownTransferTime(protocol.project)) {
    return { type: 'unknown' }
  }

  const durationSplit = protocol.project
    ? getDurationSplit(
        protocol.project.interopConfig,
        getRelevantBridgeTypes(protocol.project.interopConfig.plugins),
      )
    : undefined

  return getAverageTransferTime(protocol, durationSplit)
}

export function getAverageTransferTime(
  data: CommonInteropData,
  durationSplit: InteropDurationSplit | undefined,
): AverageTransferTime {
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

export function getAverageTransferTimeSeconds(
  data: CommonInteropData,
): number | null {
  if (data.transfersWithDurationCount <= 0) return null

  return Math.floor(data.totalDurationSum / data.transfersWithDurationCount)
}

export function hasUnknownTransferTime(
  project: ProjectMetadata | undefined,
): boolean {
  return project?.interopConfig.transfersTimeMode === 'unknown'
}

function getRelevantBridgeTypes(
  plugins: { bridgeType: KnownInteropBridgeType }[],
): KnownInteropBridgeType[] {
  return [...new Set(plugins.map((plugin) => plugin.bridgeType))]
}

function getDurationSplit(
  interopConfig: InteropConfig,
  bridgeTypes: KnownInteropBridgeType[],
): InteropDurationSplit | undefined {
  const durationSplits = interopConfig.durationSplit
  if (!durationSplits) return undefined

  const [firstBridgeType, ...restBridgeTypes] = bridgeTypes
  if (!firstBridgeType) return undefined

  const firstDurationSplit = durationSplits[firstBridgeType]
  if (!firstDurationSplit) return undefined

  const normalizedFirst = normalizeDurationSplit(firstDurationSplit)
  const hasSameDurationSplit = restBridgeTypes.every((bridgeType) => {
    const durationSplit = durationSplits[bridgeType]
    return durationSplit !== undefined
      ? isEqual(normalizedFirst, normalizeDurationSplit(durationSplit))
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
    .sort(
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
