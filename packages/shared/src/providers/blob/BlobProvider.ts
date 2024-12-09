import { BlobClient, BlobsInBlock } from '../../clients'

export class BlobProvider {
  constructor(private readonly client: BlobClient) {}

  async getRelevantBlobs(txHash: string): Promise<BlobsInBlock> {
    return await this.client.getRelevantBlobs(txHash)
  }
}
