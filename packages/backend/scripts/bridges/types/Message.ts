import type { UnixTime } from '@l2beat/shared-pure'

export interface Message {
  direction: 'inbound' | 'outbound'
  /** Protocol used for bridging, see protocols.ts for constants */
  protocol: string
  /** Short name of the origin chain */
  origin: string
  /** Short name of the destination chain */
  destination: string
  /** Timestamp of the block in which transaction was included */
  blockTimestamp: UnixTime
  /** Transaction hash of a transaction in which event was emitted */
  txHash: string
  /** Custom property to differentiate between events from the same bridge */
  type?: string
  /** Custom id used (by given protocol) to identify other part of the transfer */
  matchingId?: string
}
