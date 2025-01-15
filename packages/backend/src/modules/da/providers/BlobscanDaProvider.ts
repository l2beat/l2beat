import { UnixTime } from '@l2beat/shared-pure'
import { BlobScanClient } from '../clients/BlobscanClient'
import { BlobSizeData, BlobsProvider } from './DaProvider'

export class BlobScanDaProvider implements BlobsProvider {
  constructor(private readonly client: BlobScanClient) {}

  async getBlobs(from: number, to: number): Promise<BlobSizeData[]> {
    const blobs = await this.client.getBlobs(from, to)

    return blobs.map((blob) => ({
      blockTimestamp: UnixTime.fromDate(new Date(blob.blockTimestamp)),
      size: blob.size,
    }))
  }

  async getBlobsCount(from: number, to: number): Promise<number> {
    return (await this.client.getBlobsCount(from, to)) ?? 0
  }
}
