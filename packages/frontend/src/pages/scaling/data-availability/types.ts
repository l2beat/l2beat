import {
  Layer2Provider,
  Layer3Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import {
  ImplementationChangeReportApiResponse,
  TvlApiResponse,
  ValueWithSentiment,
} from '@l2beat/shared-pure'

export interface DataAvailabilityPagesData {
  tvlApiResponse: TvlApiResponse
  implementationChange?: ImplementationChangeReportApiResponse
}

export interface ScalingDataAvailabilityViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  type: 'layer2' | 'layer3'
  showProjectUnderReview?: boolean
  category: ScalingProjectCategory
  provider: Layer2Provider | Layer3Provider | undefined
  warning: string | undefined
  hasImplementationChanged?: boolean
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig | undefined
  dataAvailability: DataAvailability
}

type DataAvailability = {
  layer: ValueWithSentiment<string>
  bridge: ValueWithSentiment<string>
  mode: string
}
