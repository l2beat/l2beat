import { Layer2 } from '@l2beat/config'

import { TokenControl } from '../../components/chart/CommonTokenControls'
import { RiskValues } from '../../utils/risks/types'

export interface ScalingDetailedTvlViewEntry {
  name: string
  slug: string
  riskValues: RiskValues
  category: Layer2['display']['category']
  provider?: Layer2['display']['provider']
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  isUpcoming?: boolean
  tvl?: string
  cbv?: string
  ebv?: string
  nmv?: string
  tvlChange?: string
  ebvChange?: string
  cbvChange?: string
  nmvChange?: string
  tokens: TokenControl[]
}
