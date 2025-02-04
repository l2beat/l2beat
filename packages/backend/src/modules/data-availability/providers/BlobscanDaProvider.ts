import type { BlobData, BlobScanClient, DaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

// each blob is 128 KiB so 131,072 B
const BLOB_SIZE_BYTES = 131072n

export class BlobScanDaProvider implements DaProvider {
  constructor(private readonly client: BlobScanClient) {}

  async getBlobs(from: number, to: number): Promise<BlobData[]> {
    const blobs = await this.client.getBlobs(from, to)

    return blobs.map((blob) => ({
      size: BLOB_SIZE_BYTES,
      transaction: {
        from: blob.transaction.from,
        to: blob.transaction.to,
        blockTimestamp: UnixTime.fromDate(new Date(blob.blockTimestamp)),
      },
    }))
  }
}
