import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { ScalingLivenessEntry } from '~/server/features/scaling/liveness/getScalingLivenessEntries'
import type {
  LivenessDataPoint,
  LivenessTimeRange,
} from '~/server/features/scaling/liveness/types'

export type ScalingLivenessTableEntry = Omit<ScalingLivenessEntry, 'data'> & {
  data: TableEntryData | undefined
}

type TableEntryData = Record<
  TrackedTxsConfigSubtype,
  TableEntryDataPoint | undefined
> & {
  isSynced: boolean
}

type TableEntryDataPoint = LivenessDataPoint & { warning: string | undefined }

export function toLivenessTableEntry(
  entry: ScalingLivenessEntry,
  range: LivenessTimeRange,
): ScalingLivenessTableEntry {
  if (!entry.data) {
    return {
      ...entry,
      data: undefined,
    }
  }

  const stateUpdates = entry.data.stateUpdates?.[range]
  const batchSubmissions = entry.data.batchSubmissions?.[range]
  const proofSubmissions = entry.data.proofSubmissions?.[range]

  return {
    ...entry,
    data: {
      stateUpdates: stateUpdates
        ? {
            ...stateUpdates,
            warning: entry.data.stateUpdates?.warning,
          }
        : undefined,
      batchSubmissions: batchSubmissions
        ? {
            ...batchSubmissions,
            warning: entry.data.batchSubmissions?.warning,
          }
        : undefined,
      proofSubmissions: proofSubmissions
        ? {
            ...proofSubmissions,
            warning: entry.data.proofSubmissions?.warning,
          }
        : undefined,
      isSynced: entry.data.isSynced,
    },
  }
}
