import {
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectDataAvailabilityMode,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import {
  LivenessApiResponse,
  LivenessDetails,
  TvlApiResponse,
} from '@l2beat/shared-pure'
export interface LivenessPagesData {
  tvlApiResponse: TvlApiResponse
  livenessApiResponse: LivenessApiResponse
}

export interface ScalingLivenessViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory
  dataAvailabilityMode: ScalingProjectDataAvailabilityMode | undefined
  provider: Layer2Provider | undefined
  warning: string | undefined
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig
  explanation: string | undefined
  batchSubmissions: LivenessDetailsWithWarning | undefined
  stateUpdates: LivenessDetailsWithWarning | undefined
  proofSubmissions: LivenessDetailsWithWarning | undefined
  anomalyEntries: AnomalyIndicatorEntry[]
  isSynced: boolean
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
