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
import { type SyncStatus } from '~/types/SyncStatus'

export interface ScalingFinalityEntry {
  slug: string
  name: string
  shortName: string | undefined
  category: ScalingProjectCategory
  type: 'layer2' | 'layer3'
  dataAvailabilityMode: DataAvailabilityMode | undefined
  provider: Layer2Provider | undefined
  warning: string | undefined
  showProjectUnderReview?: boolean
  hasImplementationChanged?: boolean
  redWarning?: string | undefined
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
  syncStatus: SyncStatus
}
