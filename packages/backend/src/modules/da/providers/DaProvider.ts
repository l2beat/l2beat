import { UnixTime } from '@l2beat/shared-pure'

export type BlobSizeData = {
  blockTimestamp: UnixTime
  size: number
}

export interface BlobsProvider {
  getBlobs(from: number, to: number): Promise<BlobSizeData[]>
  getBlobsCount(from: number, to: number): Promise<number>
}
