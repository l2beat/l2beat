import { Layer2 } from '@l2beat/config'

import { RiskValues } from '../../utils/risks/types'

export interface DetailedTvlViewEntry {
  name: string
  slug: string
  riskValues: RiskValues
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
}
