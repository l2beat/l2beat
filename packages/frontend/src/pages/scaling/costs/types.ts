import {
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'
import {
  ActivityApiResponse,
  ImplementationChangeReportApiResponse,
  L2CostsApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { SyncStatus, ValueWithDisplayValue } from '../../types'

export interface CostsPagesData {
  tvlApiResponse: TvlApiResponse
  l2CostsApiResponse: L2CostsApiResponse
  activityApiResponse: ActivityApiResponse | undefined
  implementationChange: ImplementationChangeReportApiResponse | undefined
}

export interface ScalingCostsViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
  warning: string | undefined
  redWarning: string | undefined
  category: ScalingProjectCategory
  provider: Layer2Provider | undefined
  purposes: ScalingProjectPurpose[]
  stage: StageConfig
  data: CostsData
}

export type CostsData = {
  last24h: CostsDataDetails
  last7d: CostsDataDetails
  last30d: CostsDataDetails
  last90d: CostsDataDetails
  last180d: CostsDataDetails
  syncStatus: SyncStatus
}

export type CostsDataDetails = {
  total: CostsDataBreakdown
  calldata: CostsDataBreakdown
  blobs: CostsDataBreakdown | undefined
  compute: CostsDataBreakdown
  overhead: CostsDataBreakdown
  txCount: ValueWithDisplayValue | undefined
}

export type CostsDataBreakdown = {
  ethCost: TotalCostsValue
  usdCost: TotalCostsValue
  gas: TotalCostsValue
}

export interface TotalCostsValue extends ValueWithDisplayValue {
  perL2Tx: ValueWithDisplayValue | undefined
}
