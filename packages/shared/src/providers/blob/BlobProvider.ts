import { BlobClient, BlobsInBlock } from '../../services'

export class BlobProvider {
  constructor(private readonly client: BlobClient) {}

  async getRelevantBlobs(txHash: string): Promise<BlobsInBlock> {
    return await this.client.getRelevantBlobs(txHash)
  }
}
