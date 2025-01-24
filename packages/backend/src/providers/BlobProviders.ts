import { type BlobClient, BlobProvider } from '@l2beat/shared'

export class BlobProviders {
  private readonly blobProvider: BlobProvider
  constructor(private readonly blobClient: BlobClient) {
    this.blobProvider = new BlobProvider(blobClient)
  }

  getBlobProvider() {
    return this.blobProvider
  }
}
