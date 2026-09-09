import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { L2LivenessEntry } from '~/server/features/layer2s/liveness/getL2LivenessEntries'
import type {
  LivenessDataPoint,
  LivenessTimeRange,
} from '~/server/features/layer2s/liveness/types'

export type L2LivenessTableEntry = Omit<L2LivenessEntry, 'data'> & {
  data: TableEntryData | undefined
}

type TableEntryData = Record<
  TrackedTxsConfigSubtype,
  TableEntryDataPoint | undefined | null
> & {
  isSynced: boolean
}

type TableEntryDataPoint = LivenessDataPoint & { warning: string | undefined }

export function toLivenessTableEntry(
  entry: L2LivenessEntry,
  range: LivenessTimeRange,
): L2LivenessTableEntry {
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
        : stateUpdates,
      batchSubmissions: batchSubmissions
        ? {
            ...batchSubmissions,
            warning: entry.data.batchSubmissions?.warning,
          }
        : batchSubmissions,
      proofSubmissions: proofSubmissions
        ? {
            ...proofSubmissions,
            warning: entry.data.proofSubmissions?.warning,
          }
        : proofSubmissions,
      isSynced: entry.data.isSynced,
    },
  }
}
