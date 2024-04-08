import { ScalingProjectRiskViewEntry } from '@l2beat/config'

import { TokenBreakdownProps } from '../../../components/breakdown/TokenBreakdown'
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
  hasImplementationChanged?: boolean
  showProjectUnderReview?: boolean
  tvl?: ValueWithDisplayValue
  tvlBreakdown?: TokenBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  bridgesMarketShare?: string
  combinedMarketShare?: ValueWithDisplayValue
  validatedBy?: ScalingProjectRiskViewEntry
  category: string
}
