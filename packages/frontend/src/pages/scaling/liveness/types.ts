import { Layer2, StageConfig } from '@l2beat/config'
import { LivenessDetails } from '@l2beat/shared-pure'
export interface ScalingLivenessViewEntry {
  name: string
  slug: string
  category: Layer2['display']['category']
  dataAvailabilityMode: Layer2['display']['dataAvailabilityMode']
  provider: Layer2['display']['provider'] | undefined
  warning: string | undefined
  stage: StageConfig
  explanation: string | undefined
  batchSubmissions: LivenessDetails | undefined
  stateUpdates: LivenessDetails | undefined
  proofSubmissions: LivenessDetails | undefined
  anomalyEntries: AnomalyIndicatorEntry[]
}

export interface ScalingLivenessViewSortingOrder {
  name: string[]
  txDataSubmissions: string[]
  stateUpdates: string[]
  technology: string[]
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
  type: 'TX DATA SUBMISSION' | 'STATE UPDATE' | 'PROOF SUBMISSION'
  timestamp: number
  durationInSeconds: number
}
