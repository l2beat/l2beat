import {
  type DataAvailabilityMode,
  type Layer2Provider,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type StageConfig,
} from '@l2beat/config'
import {
  type FinalityDataPoint,
  type WarningValueWithSentiment,
} from '@l2beat/shared-pure'

export interface ScalingFinalityEntry {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory
  dataAvailabilityMode: DataAvailabilityMode | undefined
  provider: Layer2Provider | undefined
  warning: string | undefined
  hasImplementationChanged?: boolean
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig
  data: ScalingFinalityEntryData | undefined
  finalizationPeriod?: string
}

export interface ScalingFinalityEntryData {
  timeToInclusion: {
    warning?: WarningValueWithSentiment
  } & FinalityDataPoint
  stateUpdateDelay?: {
    warning?: WarningValueWithSentiment
    averageInSeconds: number
  }
  syncStatus: {
    isSynced: boolean
    displaySyncedUntil?: string
  }
}
