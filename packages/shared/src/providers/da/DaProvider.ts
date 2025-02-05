import type { UnixTime } from '@l2beat/shared-pure'

export type BlobSizeData = {
  size: bigint
  blockTimestamp: UnixTime
}

export type BlobData = {
  size: bigint
  transaction: {
    blockTimestamp: UnixTime
    from: string
    to: string
  }
}

export interface DaProvider {
  getBlobs(from: number, to: number): Promise<BlobData[]>
}
