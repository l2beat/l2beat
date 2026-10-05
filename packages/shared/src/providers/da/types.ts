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

export type DaBlob = EthereumBlob
