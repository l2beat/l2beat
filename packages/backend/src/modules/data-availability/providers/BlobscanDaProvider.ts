import type { BlobScanClient, BlobSizeData, DaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

// each blob is 128 KiB so 131,072 B
const BLOB_SIZE_BYTES = 131072n

export class BlobScanDaProvider implements DaProvider {
  constructor(private readonly client: BlobScanClient) {}

  async getBlobsByAddress(
    from: number,
    to: number,
    toAddress: string,
    fromAddresses?: string[],
  ): Promise<BlobSizeData[]> {
    let txs = await this.client.getTransactionsWithBlobsByAddress(
      from,
      to,
      toAddress,
    )

    if (fromAddresses && fromAddresses.length > 0) {
      txs = txs.filter((tx) => fromAddresses.includes(tx.from))
    }

    return txs.flatMap((tx) =>
      tx.blobs.map(() => ({
        blockTimestamp: UnixTime.fromDate(new Date(tx.blockTimestamp)),
        size: BLOB_SIZE_BYTES,
      })),
    )
  }

  async getBlobs(from: number, to: number): Promise<BlobSizeData[]> {
    const blobs = await this.client.getBlobs(from, to)

    return blobs.map((blob) => ({
      blockTimestamp: UnixTime.fromDate(new Date(blob.blockTimestamp)),
      size: BLOB_SIZE_BYTES,
    }))
  }
}
