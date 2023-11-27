import { Layer2, StageConfig } from '@l2beat/config'

interface DataPoint {
  averageInSeconds: number
  maximumInSeconds: number
}

export interface ScalingLivenessViewEntry {
  name: string
  slug: string
  category: Layer2['display']['category']
  dataAvailabilityMode: Layer2['display']['dataAvailabilityMode']
  provider: Layer2['display']['provider'] | undefined
  warning: string | undefined
  stage: StageConfig
  explanation: string | undefined
  batchSubmissions?:
    | {
        last30Days?: DataPoint | undefined
        last90Days?: DataPoint | undefined
        max?: DataPoint | undefined
      }
    | undefined
  stateUpdates?:
    | {
        last30Days?: DataPoint | undefined
        last90Days?: DataPoint | undefined
        max?: DataPoint | undefined
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
