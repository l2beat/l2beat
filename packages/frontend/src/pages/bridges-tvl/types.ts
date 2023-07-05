import { ProjectRiskViewEntry } from '@l2beat/config'

import { TVLBreakdownProps } from '../../components/TVLBreakdown'

export interface BridgesTvlViewEntry {
  type: 'bridge' | 'layer2'
  name: string
  slug: string
  warning?: string
  isArchived?: boolean
  isUpcoming?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  tvl?: string
  tvlBreakdown?: TVLBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  bridgesMarketShare?: string
  combinedMarketShare?: string
  validatedBy?: ProjectRiskViewEntry
  category: string
}
