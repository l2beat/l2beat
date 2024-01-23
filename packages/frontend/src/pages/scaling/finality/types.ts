import {
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import { FinalityApiResponse, TvlApiResponse } from '@l2beat/shared-pure'

export interface FinalityPagesData {
  finalityApiResponse: FinalityApiResponse
  tvlApiResponse: TvlApiResponse
}

export interface ScalingFinalityViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory
  dataAvailabilityMode: 'Transaction data' | 'State diffs' | undefined
  provider: Layer2Provider | undefined
  warning: string | undefined
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig
  timeToFinalize: {
    averageInSeconds: number
    maximumInSeconds: number
    warning?: string
  }
  finalizationPeriod?: string
}
