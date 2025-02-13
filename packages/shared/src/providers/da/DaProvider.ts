import type { UnixTime } from '@l2beat/shared-pure'

export interface DaBlobBase {
  daLayer: string
  blockTimestamp: UnixTime
  size: bigint
}

export interface EthereumBlob extends DaBlobBase {
  type: 'ethereum'
  inbox: string
  sequencer: string
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

export interface DaProvider {
  getBlobs(from: number, to: number): Promise<DaBlob[]>
}
