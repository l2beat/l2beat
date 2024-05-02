import {
  Layer2Provider,
  Layer3Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
  WarningWithSentiment,
} from '@l2beat/config'

import { TokenControl } from '../../../components/chart/TokenControls'
import { RiskValues } from '../../../utils/risks/types'
import { ValueWithDisplayValue } from '../../types'

export interface ScalingTvlViewEntry {
  type: 'layer2' | 'layer3'
  name: string
  shortName: string | undefined
  slug: string
  riskValues: RiskValues
  category: ScalingProjectCategory
  provider?: Layer2Provider | Layer3Provider
  warning?: string
  redWarning: string | undefined
  tvlWarning?: WarningWithSentiment
  purposes: ScalingProjectPurpose[]
  isArchived?: boolean
  isVerified?: boolean
  hasImplementationChanged?: boolean
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
