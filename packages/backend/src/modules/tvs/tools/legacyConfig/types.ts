import type { ProjectEscrowSource, SharedEscrow } from '@l2beat/config'
import type {
  EthereumAddress,
  Token,
  TokenBridgedUsing,
  UnixTime,
} from '@l2beat/shared-pure'

/** This is the config used for the old (current) version of TVL. Don't use it for the new tvs implementation. */
export interface LegacyProjectConfig {
  escrows: LegacyEscrow[]
  tokens: Token[]
  associatedTokens: string[]
}

/** This is the escrow used for the old (current) version of TVL. Don't use it for the new tvs implementation. */
export interface LegacyEscrow {
  address: EthereumAddress
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
  tokens: (Token & { isPreminted: boolean })[]
  chain: string
  includeInTotal?: boolean
  source?: ProjectEscrowSource
  bridgedUsing?: TokenBridgedUsing
  sharedEscrow?: SharedEscrow
}
