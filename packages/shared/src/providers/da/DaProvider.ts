import type { UnixTime } from '@l2beat/shared-pure'

export type DaBlob = {
  blockTimestamp: UnixTime
  size: bigint
}

export interface DaProvider {
  getBlobs(from: number, to: number): Promise<DaBlob[]>
}
