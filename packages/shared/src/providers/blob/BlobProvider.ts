import { BlobClient } from '../../clients'
import { BlobsInBlock } from '../../clients/blobs/types'

export class BlobProvider {
  constructor(private readonly client: BlobClient) {}

  async getRelevantBlobs(txHash: string): Promise<BlobsInBlock> {
    return await this.client.getRelevantBlobs(txHash)
  }
}
