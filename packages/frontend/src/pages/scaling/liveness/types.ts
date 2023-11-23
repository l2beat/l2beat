import { Layer2, StageConfig } from '@l2beat/config'
import { LivenessDataPoint } from '@l2beat/shared-pure'

export interface ScalingLivenessViewEntry {
  name: string
  slug: string
  category: Layer2['display']['category']
  dataAvailabilityMode: Layer2['display']['dataAvailabilityMode']
  provider: Layer2['display']['provider'] | undefined
  warning: string | undefined
  stage: StageConfig
  batchSubmissions?:
    | {
        last30Days?: LivenessDataPoint | undefined
        last90Days?: LivenessDataPoint | undefined
        allTime?: LivenessDataPoint | undefined
      }
    | undefined
  stateUpdates?:
    | {
        last30Days?: LivenessDataPoint | undefined
        last90Days?: LivenessDataPoint | undefined
        allTime?: LivenessDataPoint | undefined
      }
    | undefined
  anomalyEntries: AnomalyIndicatorEntry[]
}

export type AnomalyIndicatorEntry = AnomalyEntry | NonAnomalyEntry
export interface AnomalyEntry {
  isAnomaly: true
  anomalies: Anomaly[]
}

export interface NonAnomalyEntry {
  isAnomaly: false
}
export interface Anomaly {
  type: 'BATCH SUBMISSION' | 'STATE UPDATE'
  timestamp: number
  durationInSeconds: number
}
