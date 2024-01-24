import {
  Layer2Provider,
  Layer3Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
} from '@l2beat/config'

import { TokenBreakdownProps } from '../../../components/TokenBreakdown'
import { RiskValues } from '../../../utils/risks/types'
import { ValueWithDisplayValue } from '../../types'

export interface ScalingSummaryViewEntryBase {
  name: string
  shortName: string | undefined
  slug: string
  category: ScalingProjectCategory
  warning?: string
  redWarning?: string
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  isUpcoming?: boolean
  purposes: ScalingProjectPurpose[]
}

export interface ScalingL2SummaryViewEntry extends ScalingSummaryViewEntryBase {
  riskValues: RiskValues
  stage: StageConfig
  tvl?: ValueWithDisplayValue
  tvlTooltip?: string
  tvlBreakdown?: TokenBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  marketShare?: ValueWithDisplayValue
  marketShareValue?: number
  provider?: Layer2Provider
}

export interface ScalingL3SummaryViewEntry extends ScalingSummaryViewEntryBase {
  hostChainName?: string
  provider?: Layer3Provider
  stage?: never
}

export type ScalingSummaryViewEntry =
  | ScalingL2SummaryViewEntry
  | ScalingL3SummaryViewEntry
