import type { UnixTime } from '@l2beat/shared-pure'

export type BlobSizeData = {
  blockTimestamp: UnixTime
  size: bigint
}

export interface BlobsProvider {
  getBlobs(from: number, to: number): Promise<BlobSizeData[]>
  getBlobsByAddress(
    from: number,
    to: number,
    toAddress: string,
    fromAddresses?: string[],
  ): Promise<BlobSizeData[]>
}
