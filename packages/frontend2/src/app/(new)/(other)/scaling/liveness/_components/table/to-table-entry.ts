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
          }
        | undefined
      > & { syncStatus: SyncStatus })
    | undefined
}

export function toLivenessTableEntry(
  entry: ScalingLivenessEntry,
  range: LivenessTimeRange,
): ScalingLivenessTableEntry {
  return {
    ...entry,
    data: entry.data
      ? {
          stateUpdates: entry.data.stateUpdates?.[range],
          batchSubmissions: entry.data.batchSubmissions?.[range],
          proofSubmissions: entry.data.proofSubmissions?.[range],
          syncStatus: entry.data.syncStatus,
        }
      : undefined,
  }
}
