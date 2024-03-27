import {
  L2CostsApiProject,
  L2CostsApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { ValueWithDisplayValue } from '../../types'

export interface CostsPagesData {
  tvlApiResponse: TvlApiResponse
  costsApiResponse: L2CostsApiResponse
}

export interface ScalingCostsViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  warning: string | undefined
  redWarning: string | undefined
  showProjectUnderReview: boolean
  costs: CostsData
}

export type CostsData = {
  [Timerange in keyof Omit<
    L2CostsApiProject,
    'syncedUntil'
  >]-?: CostsDataDetails
}

export type CostsDataDetails = {
  total: CostsDataBreakdown
  calldata: CostsDataBreakdown
  blobs: CostsDataBreakdown | undefined
  compute: CostsDataBreakdown
  overhead: CostsDataBreakdown
}

export type CostsDataBreakdown = {
  ethCost: ValueWithDisplayValue
  usdCost: ValueWithDisplayValue
  gas: ValueWithDisplayValue
}
