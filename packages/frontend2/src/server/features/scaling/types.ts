import { type WarningWithSentiment } from '@l2beat/config'
import { type TokenBreakdownProps } from '~/app/_components/breakdown/token-breakdown'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { type CommonScalingEntry } from './get-common-scaling-entry'

export type ScalingSummaryLayer2sEntry = CommonScalingEntry & {
  risks: RosetteValue[]
  tvlData: L2TvlData | undefined
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
}

export type ScalingSummaryLayer3sEntry = CommonScalingEntry & {
  risks: undefined
  tvlData: L3TvlData | undefined
  // NOTE: It is never to satisfy the type of the data in ProjectNameCell
  syncStatus?: never
  hostChainName: string
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
