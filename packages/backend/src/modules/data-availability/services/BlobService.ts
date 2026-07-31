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
        txHash: blob.txHash,
        blobCount: blob.blobCount,
        logs: blob.logs,
        topics: null, // legacy column: new writes derive topics from logs
      }
    })

    await this.db.txWithBlobs.insertMany(records)
  }

  async get(daLayer: string, from: number, to: number): Promise<DaBlob[]> {
    assert(
      daLayer === 'ethereum',
      'Only ethereum blobs are supported in BlobService',
    )

    const records = await this.db.txWithBlobs.getByBlockRangeInclusive(
      daLayer,
      from,
      to,
    )

    return records.map((record) => ({
      type: 'ethereum',
      daLayer: record.daLayer,
      blockTimestamp: record.timestamp,
      blockNumber: record.blockNumber,
      size: ETHEREUM_BLOB_SIZE_BYTES * BigInt(record.blobCount),
      inbox: record.to ?? '',
      sequencer: record.from,
      txHash: record.txHash,
      blobCount: record.blobCount,
      topics: record.logs?.flatMap((log) => log.topics) ?? record.topics ?? [],
      logs: record.logs,
    }))
  }

  async deleteAfter(daLayer: string, from: number) {
    assert(
      daLayer === 'ethereum',
      'Only ethereum blobs are supported in BlobService',
    )

    return await this.db.txWithBlobs.deleteAfter(daLayer, from)
  }
}
