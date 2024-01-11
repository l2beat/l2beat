import {
  Layer2Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'

import { TokenControl } from '../../../components/chart/TokenControls'
import { RiskValues } from '../../../utils/risks/types'
import { ValueWithDisplayValue } from '../../types'

export interface ScalingTvlViewEntry {
  name: string
  shortName: string | undefined
  slug: string
  riskValues: RiskValues
  category: ScalingProjectCategory
  provider?: Layer2Provider
  warning?: string
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
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
