import { ProjectCategory, ProjectProvider, StageConfig } from '@l2beat/config'

import { TVLBreakdownProps } from '../../../components/TVLBreakdown'
import { RiskValues } from '../../../utils/risks/types'
import { ValueWithDisplayValue } from '../../types'

export interface ScalingSummaryViewEntryBase {
  name: string
  slug: string
  category: ProjectCategory
  provider?: ProjectProvider
  warning?: string
  redWarning?: string
  isArchived?: boolean
  isVerified?: boolean
  showProjectUnderReview?: boolean
  isUpcoming?: boolean
  purpose: string
}

export interface ScalingSummaryViewEntryLayer2
  extends ScalingSummaryViewEntryBase {
  type: 'layer2'
  riskValues: RiskValues
  stage: StageConfig
  tvl?: ValueWithDisplayValue
  tvlTooltip?: string
  tvlBreakdown?: TVLBreakdownProps
  oneDayChange?: string
  sevenDayChange?: string
  marketShare?: ValueWithDisplayValue
  marketShareValue?: number
}

export interface ScalingSummaryViewEntryLayer3
  extends ScalingSummaryViewEntryBase {
  type: 'layer3'
  hostChainName?: string
  stage: {
    stage: 'NotApplicable'
  }
}

export type ScalingSummaryViewEntry =
  | ScalingSummaryViewEntryLayer2
  | ScalingSummaryViewEntryLayer3
