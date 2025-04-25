import type { ProjectEscrowSource, SharedEscrow } from '@l2beat/config'
import type {
  EthereumAddress,
  LegacyToken,
  LegacyTokenBridgedUsing,
  UnixTime,
} from '@l2beat/shared-pure'

/** This is the config used for the old (current) version of TVL. Don't use it for the new tvs implementation. */
export interface LegacyProjectConfig {
  escrows: LegacyEscrow[]
  tokens: LegacyToken[]
  associatedTokens: string[]
}

/** This is the escrow used for the old (current) version of TVL. Don't use it for the new tvs implementation. */
export interface LegacyEscrow {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  tokens: (LegacyToken & { isPreminted: boolean })[]
  chain: string
  includeInTotal?: boolean
  source?: ProjectEscrowSource
  bridgedUsing?: LegacyTokenBridgedUsing
  sharedEscrow?: SharedEscrow
}
