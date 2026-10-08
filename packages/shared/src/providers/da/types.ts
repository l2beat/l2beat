import type { UnixTime } from '@l2beat/shared-pure'

export interface DaBlobBase {
  daLayer: string
  blockTimestamp: UnixTime
  blockNumber: number
  size: bigint
}

export interface EthereumBlob extends DaBlobBase {
  type: 'ethereum'
  inbox: string
  sequencer: string
  topics: string[]
}

/** An Ethereum block and the blob transactions in it */
export interface EthereumBlobBlock {
  number: number
  hash: string
  parentHash: string
  timestamp: UnixTime
  /** In the block's order */
  batches: EthereumBlobBatch[]
}

/** One blob transaction: the blobs a sender posted at once */
export interface EthereumBlobBatch {
  /** Position of the transaction in its block */
  txIndex: number
  txHash: string
  from: string
  to: string
  /** Of every log the transaction emitted, internal calls included */
  topics: string[]
  blobs: number
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
