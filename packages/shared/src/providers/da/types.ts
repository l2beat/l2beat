import type { UnixTime } from '@l2beat/shared-pure'

export interface EthereumBlobLog {
  emitter: string
  topics: string[]
}

export interface DaBlobBase {
  daLayer: string
  blockTimestamp: UnixTime
  blockNumber: number
  size: bigint
}

/**
 * One blob-carrying transaction, not one blob - `size` is the total for all
 * `blobCount` blobs of the tx. All matching inputs (inbox, sequencer, logs)
 * are transaction-level anyway.
 */
export interface EthereumBlob extends DaBlobBase {
  type: 'ethereum'
  inbox: string
  sequencer: string
  /** Null for cache rows backfilled from the legacy per-blob table. */
  txHash: string | null
  blobCount: number
  /** All log topics of the tx, flattened. Derived from `logs` when present. */
  topics: string[]
  /** Null for cache rows written before logs were persisted. */
  logs: EthereumBlobLog[] | null
}

export interface AvailBlob extends DaBlobBase {
  type: 'avail'
  appId: string
}

export interface CelestiaBlob extends DaBlobBase {
  type: 'celestia'
  namespace: string
}

export type DaBlob = EthereumBlob | AvailBlob | CelestiaBlob
