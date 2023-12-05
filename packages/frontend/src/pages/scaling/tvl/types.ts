import { Layer2, StageConfig } from '@l2beat/config'

import { TVLBreakdownProps } from '../../../components/TVLBreakdown'
import { RiskValues } from '../../../utils/risks/types'

export interface ScalingTvlViewEntry {
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
  isLayer3?: boolean
  hostChainName?: string
  tvl?: string
  tvlTooltip?: string
  tvlBreakdown?: TVLBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  marketShare?: string
  purpose: string
  stage: StageConfig
}
