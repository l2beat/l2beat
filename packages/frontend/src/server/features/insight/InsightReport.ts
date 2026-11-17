import type { TokenCategory, UnixTime } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'

export type InsightReportResult =
  | { status: 'ok'; report: InsightReport }
  /** The holder index of Ethereum answers -32001: an empty list would lie. */
  | { status: 'indexNotReady' }
  | { status: 'notConfigured' }
  /** Not a name ENSIP-15 accepts. */
  | { status: 'invalidName' }
  /** No address, or one served offchain, which Insight does not follow. */
  | { status: 'notResolved' }

export interface InsightReport {
  /** Lowercase, `0x`-prefixed. */
  holder: string
  /** The normalized ENS name the visitor typed, if they typed one. */
  ensName: string | null
  /** Every balance was read at this block. */
  blockNumber: number
  /** Prices are the latest hourly price at or before this hour. */
  priceTimestamp: UnixTime
  /** Valued holdings first, by value; then the unpriced ones by symbol. */
  holdings: InsightHolding[]
  totalValueUsd: number
  /**
   * Tokens the holder index lists but token-db does not know. Their balances
   * are not read, so a holding may hide among them.
   */
  untrackedTokenCount: number
  /** Tokens token-db knows, which the holder touched but holds none of now. */
  emptyTrackedTokenCount: number
  /** Tokens token-db knows whose `balanceOf` reverted or returned garbage. */
  unreadableTokenCount: number
}

export interface InsightHolding {
  /** Lowercase `0x` address, or `native` for ETH. */
  address: string
  symbol: string
  iconUrl: string | null
  issuer: string | null
  category: TokenCategory | null
  /** Whether a human reviewed the abstract token in token-db. */
  reviewed: boolean
  abstractTokenId: string | null
  /** Exact balance in the smallest unit, as a decimal string. */
  balance: string
  decimals: number
  /** Null when token-db has no price, the price is unreliable or too old. */
  valueUsd: number | null
  backing: InsightBacking
}

/** How the Ethereum deployment relates to deployments on other chains. */
export interface InsightBacking {
  /** Minted on Ethereum against tokens locked on another chain. */
  mintedAgainst: InsightRouteGroup[]
  /** Minted and burned across chains with no escrow behind it. */
  burnAndMint: InsightRouteGroup[]
  /** Locked on Ethereum to mint a representation on another chain. */
  lockedFor: InsightRouteGroup[]
  /** A lock-and-mint relation whose locked side is not identified yet. */
  unknownRole: InsightRouteGroup[]
}

export interface InsightRouteGroup {
  /** Interop protocols matching the plugin; empty when none is configured. */
  bridges: ProjectIconListItem[]
  plugin: string
  chains: InsightChain[]
}

export interface InsightChain {
  id: string
  name: string
  iconUrl: string | undefined
}
