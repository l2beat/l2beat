import { Layer2, Layer2Maturity } from '@l2beat/config'

import { TVLBreakdownProps } from '../../components/TVLBreakdown'
import { RiskValues } from '../../utils/risks/types'

export interface ScalingTvlViewEntry {
  name: string
  slug: string
  riskValues: RiskValues
  provider?: Layer2['technology']['provider']
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  isUpcoming?: boolean
  tvl?: string
  tvlBreakdown?: TVLBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  marketShare?: string
  purpose: string
  technology: string
  maturityEntry?: Layer2Maturity
}
