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

export interface EthereumBlob extends DaBlobBase {
  type: 'ethereum'
  inbox: string
  sequencer: string
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
