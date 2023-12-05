import { Layer2Display, StageConfig } from '@l2beat/config'
import { LivenessDetails } from '@l2beat/shared-pure'

export interface ScalingLivenessViewEntry {
  name: string
  slug: string
  category: Layer2Display['category']
  dataAvailabilityMode: Layer2Display['dataAvailabilityMode']
  provider: Layer2Display['provider'] | undefined
  warning: string | undefined
  stage: StageConfig
  explanation: string | undefined
  batchSubmissions: LivenessDetailsWithWarning | undefined
  stateUpdates: LivenessDetailsWithWarning | undefined
  proofSubmissions: LivenessDetailsWithWarning | undefined
  anomalyEntries: AnomalyIndicatorEntry[]
}

export type LivenessDetailsWithWarning = LivenessDetails & {
  warning?: string
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
