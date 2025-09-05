import type {
  DaBridgeLivenessEntry,
  DaLivenessEntry,
} from '~/server/features/data-availability/liveness/getDaLivenessEntries'
import type {
  LivenessDataPoint,
  LivenessTimeRange,
} from '~/server/features/scaling/liveness/types'

export type DaLivenessBridgeTableEntry = Omit<DaBridgeLivenessEntry, 'data'> & {
  data:
    | (LivenessDataPoint & { warning: string | undefined; isSynced: boolean })
    | undefined
}

export type DaLivenessTableEntry = Omit<DaLivenessEntry, 'bridges'> & {
  bridges: DaLivenessBridgeTableEntry[]
}

export function toDaLivenessTableEntry(
  entry: DaLivenessEntry,
  timeRange: LivenessTimeRange,
): DaLivenessTableEntry {
  return {
    ...entry,
    bridges: entry.bridges.map((bridge) => {
      const data = bridge.data?.[timeRange]
      return {
        ...bridge,
        data: data
          ? {
              ...data,
              warning: bridge.data.warning,
              isSynced: bridge.data.isSynced,
            }
          : undefined,
      }
    }),
  }
}
