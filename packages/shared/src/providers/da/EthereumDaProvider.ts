import { UnixTime } from '@l2beat/shared-pure'
import type { BlobScanClient } from '../../clients'
import type { DaBlobProvider } from './DaProvider'
import type { DaBlob } from './types'

// each blob is 128 KiB so 131,072 B
const BLOB_SIZE_BYTES = 131072n

export class EthereumDaProvider implements DaBlobProvider {
  constructor(
    private readonly client: BlobScanClient,
    readonly daLayer: string,
  ) {}

  async getBlobs(from: number, to: number): Promise<DaBlob[]> {
    const blobs = await this.client.getBlobs(from, to)

    return blobs.map((blob) => ({
      type: 'ethereum',
      daLayer: this.daLayer,
      blockTimestamp: UnixTime.fromDate(new Date(blob.blockTimestamp)),
      size: BLOB_SIZE_BYTES,
      inbox: blob.transaction.to,
      sequencer: blob.transaction.from,
    }))
  }
}
