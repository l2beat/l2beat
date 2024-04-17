import {
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import {
  ImplementationChangeReportApiResponse,
  L2FeesApiResponse,
} from '@l2beat/shared-pure'

export interface FeesPagesData {
  l2FeesApiResponse: L2FeesApiResponse
  implementationChange: ImplementationChangeReportApiResponse | undefined
}

export interface ScalingFeesViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
  warning: string | undefined
  redWarning: string | undefined
  category: ScalingProjectCategory | undefined
  provider: Layer2Provider | undefined
  purposes: ScalingProjectPurpose[] | undefined
  stage: StageConfig | undefined
  data: FeesData | undefined
}

export type FeesData = {
  ethTransfer: FeesDataBreakdown
  erc20Transfer: FeesDataBreakdown
  swap: FeesDataBreakdown
}

export type FeesDataBreakdown = {
  usdFee: number
  gas: number
}
