import { ScalingProjectRiskViewEntry } from '@l2beat/config'

import { TVLBreakdownProps } from '../../../components/TVLBreakdown'
import { ValueWithDisplayValue } from '../../types'

export interface BridgesSummaryViewEntry {
  type: 'bridge' | 'layer2'
  shortName: string | undefined
  name: string
  slug: string
  warning?: string
  isArchived?: boolean
  isUpcoming?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  tvl?: ValueWithDisplayValue
  tvlBreakdown?: TVLBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  bridgesMarketShare?: string
  combinedMarketShare?: ValueWithDisplayValue
  validatedBy?: ScalingProjectRiskViewEntry
  category: string
}
