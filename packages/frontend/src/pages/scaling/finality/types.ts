import {
  DataAvailabilityMode,
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import {
  FinalityApiResponse,
  FinalityDataPoint,
  ImplementationChangeReportApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { SyncStatus } from '../../types'
import { WarningValueWithSentiment } from '@l2beat/shared-pure'

export interface FinalityPagesData {
  finalityApiResponse: FinalityApiResponse
  tvlApiResponse: TvlApiResponse
  implementationChange?: ImplementationChangeReportApiResponse
}

export interface ScalingFinalityViewEntry {
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
  data: ScalingFinalityViewEntryData | undefined
  finalizationPeriod?: string
}

export interface ScalingFinalityViewEntryData {
  timeToInclusion: {
    warning?: WarningValueWithSentiment
  } & FinalityDataPoint
  stateUpdateDelay?: {
    warning?: WarningValueWithSentiment
    averageInSeconds: number
  }
  syncStatus: SyncStatus
}
