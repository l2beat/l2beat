import type { InteropDurationSplit, Project } from '@l2beat/config'
import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import type {
  AverageDuration,
  CommonInteropData,
  DurationSplitMap,
  UnknownAverageDuration,
} from '../types'

export function getAverageDuration(
  projectId: string,
  bridgeType: KnownInteropBridgeType | undefined,
  data: CommonInteropData,
  durationSplitMap: DurationSplitMap | undefined,
): Exclude<AverageDuration, UnknownAverageDuration> | null {
  const durationSplit =
    bridgeType !== undefined
      ? durationSplitMap?.get(projectId)?.get(bridgeType)
      : undefined

  // Split duration rendering is wired in a follow-up step. For now, preserve
  // current behavior and only emit the legacy two-slot shape if split data
  // has already been accumulated.
  if (
    durationSplit &&
    durationSplit.length === 2 &&
    (data.inTransferCount > 0 || data.outTransferCount > 0)
  ) {
    const [inSplit, outSplit] = durationSplit
    if (!inSplit || !outSplit) return null

    return {
      type: 'split',
      in: {
        label: inSplit.label,
        duration:
          data.inTransferCount > 0
            ? Math.floor(data.inDurationSum / data.inTransferCount)
            : null,
      },
      out: {
        label: outSplit.label,
        duration:
          data.outTransferCount > 0
            ? Math.floor(data.outDurationSum / data.outTransferCount)
            : null,
      },
    }
  }

  if (data.transferCount <= 0) return null
  return {
    type: 'single',
    duration: Math.floor(data.totalDurationSum / data.transferCount),
  }
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
