import type { BlobClient, BlobsInBlock } from '../../clients'

export class BlobProvider {
  constructor(private readonly client: BlobClient) {}

  async getBlobsByVersionedHashesAndBlockNumber(
    blobVersionedHashes: string[],
    blockNumber: number,
  ): Promise<BlobsInBlock> {
    return await this.client.getBlobsByVersionedHashesAndBlockNumber(
      blobVersionedHashes,
      blockNumber,
    )
  }

  async getRelevantBlobs(txHash: string): Promise<BlobsInBlock> {
    return await this.client.getRelevantBlobs(txHash)
  }
}
