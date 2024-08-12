import { type TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { type LivenessTimeRange } from '~/server/features/liveness/types'
import { type ScalingLivenessEntry } from '~/server/features/scaling/get-scaling-liveness-entries'
import { type SyncStatus } from '~/types/sync-status'

export type ScalingLivenessTableEntry = Omit<ScalingLivenessEntry, 'data'> & {
  data:
    | (Record<
        TrackedTxsConfigSubtype,
        | {
            averageInSeconds: number
            minimumInSeconds: number
            maximumInSeconds: number
            warning: string | undefined
          }
        | undefined
      > & { syncStatus: SyncStatus })
    | undefined
}

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
      syncStatus: entry.data.syncStatus,
    },
  }
}
