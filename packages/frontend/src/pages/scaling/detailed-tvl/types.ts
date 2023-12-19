import { Layer2, StageConfig } from '@l2beat/config'

import { TokenControl } from '../../../components/chart/TokenControls'
import { RiskValues } from '../../../utils/risks/types'
import { ValueWithDisplayValue } from '../../types'

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
  tvl?: ValueWithDisplayValue
  cbv?: ValueWithDisplayValue
  ebv?: ValueWithDisplayValue
  nmv?: ValueWithDisplayValue
  tvlChange?: string
  ebvChange?: string
  cbvChange?: string
  nmvChange?: string
  tokens: TokenControl[]
  stage: StageConfig
}
