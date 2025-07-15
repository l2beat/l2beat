import type { Database } from '@l2beat/database'
import { type DaBlob, ETHEREUM_BLOB_SIZE_BYTES } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'

export class BlobService {
  constructor(private readonly db: Database) {}

  async save(blobs: DaBlob[]) {
    const records = blobs.map((blob) => {
      assert(
        blob.type === 'ethereum',
        'Only ethereum blobs are supported in BlobService',
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

  async get(daLayer: string, from: number, to: number): Promise<DaBlob[]> {
    assert(
      daLayer === 'ethereum',
      'Only ethereum blobs are supported in BlobService',
    )

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

  async deleteAfter(daLayer: string, from: number) {
    assert(
      daLayer === 'ethereum',
      'Only ethereum blobs are supported in BlobService',
    )

    return await this.db.blobs.deleteAfter(daLayer, from)
  }
}
