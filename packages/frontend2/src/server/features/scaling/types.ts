import {
  type Layer2Provider,
  type Layer3Provider,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type StageConfig,
  type WarningWithSentiment,
} from '@l2beat/config'
import { type TokenBreakdownProps } from '~/app/_components/breakdown/token-breakdown'
import { type RosetteValue } from '~/app/_components/rosette/types'

export interface ScalingSummaryLayer2sEntry {
  type: 'layer2'
  name: string
  shortName: string | undefined
  slug: string
  href: string
  category: ScalingProjectCategory
  provider: Layer2Provider | undefined
  warning: string | undefined
  redWarning: string | undefined
  isVerified: boolean
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
  isUpcoming: boolean
  isArchived: boolean
  purposes: ScalingProjectPurpose[]
  risks: RosetteValue[]
  tvlData: L2TvlData | undefined
  stage: StageConfig
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
}

export interface ScalingSummaryLayer3sEntry {
  type: 'layer3'
  name: string
  shortName: string | undefined
  slug: string
  href: string
  category: ScalingProjectCategory
  provider: Layer3Provider | undefined
  hostChainName: string
  warning: string | undefined
  redWarning: string | undefined
  isVerified: boolean
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
  isUpcoming: boolean
  isArchived: boolean
  purposes: ScalingProjectPurpose[]
  tvlData: L3TvlData | undefined
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
}

interface L2TvlData {
  tvl: number
  tvlBreakdown: TokenBreakdownProps
  tvlWarnings: WarningWithSentiment[]
  sevenDayChange: string
  marketShare: number
  excludedTokens: Omit<L2TvlData, 'excludedTokens'> | undefined
}

interface L3TvlData {
  tvl: number
  tvlBreakdown: TokenBreakdownProps
  tvlWarnings: WarningWithSentiment[]
  sevenDayChange: string
  excludedTokens: Omit<L3TvlData, 'excludedTokens'> | undefined
}
