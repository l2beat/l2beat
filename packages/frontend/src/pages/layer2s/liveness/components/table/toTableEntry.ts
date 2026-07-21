import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { Layer2sLivenessEntry } from '~/server/features/layer2s/liveness/getLayer2sLivenessEntries'
import type {
  LivenessDataPoint,
  LivenessTimeRange,
} from '~/server/features/layer2s/liveness/types'

export type Layer2sLivenessTableEntry = Omit<Layer2sLivenessEntry, 'data'> & {
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
  entry: Layer2sLivenessEntry,
  range: LivenessTimeRange,
): Layer2sLivenessTableEntry {
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
