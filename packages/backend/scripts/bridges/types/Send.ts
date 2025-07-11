import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface Send {
  direction: 'send'
  /** Protocol used for bridging, see protocols.ts for constants */
  protocol: string
  /** Address of the token that has been send */
  token: ChainSpecificAddress
  /** Raw amount from blockchain, decimals would be calculated later */
  amount: bigint
  /** Short name of the destination chain */
  destination: string
  /** Block in which transaction was included */
  blockNumber?: bigint
  /** Transaction hash of a transaction in which event was emitted */
  txHash?: string
  /** Custom property to differentiate between events from the same bridge */
  type: string
  /** Custom id used (by given protocol) to identify other part of the transfer */
  matchingId?: string
}
