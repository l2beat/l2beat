import type { Database } from '@l2beat/database'
import {
  type BlobCache,
  type DaBlob,
  ETHEREUM_BLOB_SIZE_BYTES,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

export class DbBlobCache implements BlobCache {
  constructor(private readonly db: Database) {}

  async write(blobs: DaBlob[]) {
    const records = blobs.map((blob) => {
      assert(
        blob.type === 'ethereum',
        'Only ethereum blobs are supported in DbBlobCache',
      )
      return {
        blockNumber: blob.blockNumber,
        timestamp: blob.blockTimestamp,
        daLayer: blob.daLayer,
        from: blob.sequencer,
        to: blob.inbox,
        topics: blob.topics ?? null,
        size: null, // size is constant for Ethereum blobs
      }
    })

    await this.db.blobs.insertMany(records)
  }

  async read(daLayer: string, from: number, to: number): Promise<DaBlob[]> {
    const records = await this.db.blobs.getByBlockRangeInclusive(
      daLayer,
      from,
      to,
    )

    return records.map((record) => ({
      type: 'ethereum',
      daLayer: record.daLayer,
      blockTimestamp: record.timestamp,
      blockNumber: record.blockNumber,
      size: ETHEREUM_BLOB_SIZE_BYTES,
      inbox: record.to ?? '',
      sequencer: record.from,
      topics: record.topics ?? [],
    }))
  }

  async getHeight(daLayer: string): Promise<number> {
    const latestBlob = await this.db.blobs.getLatest(daLayer)
    if (!latestBlob) {
      return 0
    }
    return latestBlob.blockNumber
  }
}
