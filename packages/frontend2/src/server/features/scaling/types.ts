import {
  type ScalingProjectPurpose,
  type StageConfig,
  type ScalingProjectCategory,
  type Layer2Provider,
  type WarningWithSentiment,
  type Layer3Provider,
} from '@l2beat/config'
import { type TokenBreakdownProps } from '~/app/_components/breakdown/token-breakdown'
import { type RosetteValue } from '~/app/_components/rosette/types'

export interface ScalingSummaryLayer2sEntry {
  name: string
  shortName: string | undefined
  slug: string
  // TODO: Is it the best way?
  href: string
  type: ProjectType
  warning: string | undefined
  redWarning: string | undefined
  isVerified: boolean
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
  purposes: ScalingProjectPurpose[]
  risks: RosetteValue[]
  tvlData: L2TvlData | undefined
  stage: StageConfig
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
}

export interface ScalingSummaryLayer3sEntry {
  name: string
  shortName: string | undefined
  slug: string
  // TODO: Is it the best way?
  type: ProjectType
  href: string
  hostChainName: string
  warning: string | undefined
  redWarning: string | undefined
  isVerified: boolean
  showProjectUnderReview: boolean
  hasImplementationChanged: boolean
  purposes: ScalingProjectPurpose[]
  tvlData: L3TvlData | undefined
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
}

interface ProjectType {
  category: ScalingProjectCategory
  provider: Layer2Provider | Layer3Provider | undefined
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
