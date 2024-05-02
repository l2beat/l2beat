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
    warning?: string
  } & FinalityDataPoint
  stateUpdateDelay?: {
    warning?: string
    averageInSeconds: number
  }
  syncStatus: SyncStatus
}
