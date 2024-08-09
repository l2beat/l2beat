import { type ScalingProjectRiskViewEntry } from '@l2beat/config'
import { type TokenBreakdownProps } from '~/app/_components/breakdown/token-breakdown'

export type CommonBridgeEntry = {
  href: string
  name: string
  shortName: string | undefined
  slug: string
  warning?: string
  isArchived?: boolean
  isVerified?: boolean
  isUpcoming?: boolean
  hasImplementationChanged?: boolean
  showProjectUnderReview?: boolean
  type: 'layer2' | 'bridge'
  category: string
  validatedBy?: ScalingProjectRiskViewEntry
}

export type BridgesRiskEntry = {
  destination: ScalingProjectRiskViewEntry
  sourceUpgradeability?: ScalingProjectRiskViewEntry
  destinationToken?: ScalingProjectRiskViewEntry
} & CommonBridgeEntry

export type BridgesSummaryEntry = {
  destination?: ScalingProjectRiskViewEntry
  tvl?: ValueWithDisplayValue
  tvlBreakdown?: TokenBreakdownProps
  sevenDayChange?: string
  bridgesMarketShare?: number
} & CommonBridgeEntry
export interface ValueWithDisplayValue {
  value: number
  displayValue: string
}
