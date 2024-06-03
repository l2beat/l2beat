import {
  Layer2Provider,
  Layer3Provider,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  StageConfig,
  WarningWithSentiment,
} from '@l2beat/config'

import { TokenBreakdownProps } from '../../../components/breakdown/TokenBreakdown'
import { RiskValues } from '../../../utils/risks/types'
import { PagesData } from '../../Page'
import { ValueWithDisplayValue } from '../../types'

export interface SummaryPagesData
  extends Pick<
    PagesData,
    | 'tvlApiResponse'
    | 'excludedTokensTvlApiResponse'
    | 'verificationStatus'
    | 'implementationChange'
  > {}

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
  hasImplementationChanged?: boolean
  isUpcoming?: boolean
  purposes: ScalingProjectPurpose[]
  tvlTooltip?: string
}

export interface TvlData {
  tvl: ValueWithDisplayValue
  tvlBreakdown: TokenBreakdownProps
  tvlWarnings: WarningWithSentiment[]
  sevenDayChange: string
  excludedTokens: Omit<TvlData, 'excludedTokens'> | undefined
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
}

export interface ScalingL2SummaryViewEntry extends ScalingSummaryViewEntryBase {
  riskValues: RiskValues
  // TODO: Clean up this mess
  data:
    | (TvlData & {
        marketShare: ValueWithDisplayValue
        excludedTokens:
          | (Omit<TvlData, 'excludedTokens'> & {
              marketShare: ValueWithDisplayValue
            })
          | undefined
      })
    | undefined
  stage: StageConfig
  provider?: Layer2Provider
}

export interface ScalingL3SummaryViewEntry extends ScalingSummaryViewEntryBase {
  hostChainName?: string
  data: TvlData | undefined
  provider?: Layer3Provider
  stage?: never
}

export type ScalingSummaryViewEntry =
  | ScalingL2SummaryViewEntry
  | ScalingL3SummaryViewEntry
