import type { UnixTime } from '@l2beat/shared-pure'

export type DaBlobBase = {
  blockTimestamp: UnixTime
  size: bigint
}

export type EthereumBlob = DaBlobBase & {
  type: 'ethereum'
  inbox: string
  sequencer: string
}

export type AvailBlob = DaBlobBase & {
  type: 'avail'
  appId: string
}

export type CelestiaBlob = DaBlobBase & {
  type: 'celestia'
  namespace: string
}

export type DaBlob = EthereumBlob | AvailBlob | CelestiaBlob

export interface DaProvider {
  getBlobs(from: number, to: number): Promise<DaBlob[]>
}
