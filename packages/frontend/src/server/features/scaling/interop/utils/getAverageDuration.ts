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
): Exclude<AverageDuration, UnknownAverageDuration> {
  const durationSplit =
    bridgeType !== undefined
      ? durationSplitMap?.get(projectId)?.get(bridgeType)
      : undefined

  if (durationSplit) {
    return {
      type: 'split',
      in: {
        label: durationSplit.in.label,
        duration:
          data.inTransferCount > 0
            ? Math.floor(data.inDurationSum / data.inTransferCount)
            : null,
      },
      out: {
        label: durationSplit.out.label,
        duration:
          data.outTransferCount > 0
            ? Math.floor(data.outDurationSum / data.outTransferCount)
            : null,
      },
    }
  }

  return {
    type: 'single',
    duration:
      data.transferCount > 0
        ? Math.floor(data.totalDurationSum / data.transferCount)
        : 0,
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
