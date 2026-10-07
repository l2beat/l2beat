import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type LiveBlobBatchRecord,
  LiveBlobBatchRepository,
} from './LiveBlobBatchRepository'

describeDatabase(LiveBlobBatchRepository.name, (db) => {
  const repository = db.liveBlobBatch

  const A = ProjectId('a')
  const B = ProjectId('b')
  const BATCHES = [
    batch({ slot: 100, txIndex: 0, blobs: 2, projectId: A }),
    batch({ slot: 100, txIndex: 1, blobs: 1 }),
    batch({ slot: 101, txIndex: 0, blobs: 3, projectId: A }),
    batch({ slot: 101, txIndex: 2, blobs: 1, projectId: A }),
    batch({ slot: 103, txIndex: 5, blobs: 6, projectId: B }),
    batch({ slot: 104, txIndex: 0, blobs: 2 }),
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.upsertMany(BATCHES)
  })

  describe(LiveBlobBatchRepository.prototype.upsertMany.name, () => {
    it('replaces a batch fetched again', async () => {
      const refetched = batch({ slot: 104, txIndex: 0, blobs: 3, projectId: B })

      await repository.upsertMany([refetched])

      expect(await repository.getBySlotRange(0, 1000)).toEqual([
        ...BATCHES.slice(0, 5),
        refetched,
      ])
    })
  })

  describe(LiveBlobBatchRepository.prototype.getBySlotRange.name, () => {
    it('returns the batches of the slots in block order', async () => {
      expect(await repository.getBySlotRange(101, 103)).toEqual(
        BATCHES.slice(2, 5),
      )
    })
  })

  describe(LiveBlobBatchRepository.prototype.getPostedSince.name, () => {
    it('sums each project up, the unattributed batches as one', async () => {
      const posted = await repository.getPostedSince(100)

      expect(posted).toEqualUnsorted([
        // Two batches in its last slot: lastBlobs counts them both
        { projectId: A, blobs: 6, batches: 3, lastSlot: 101, lastBlobs: 4 },
        { projectId: B, blobs: 6, batches: 1, lastSlot: 103, lastBlobs: 6 },
        {
          projectId: undefined,
          blobs: 3,
          batches: 2,
          lastSlot: 104,
          lastBlobs: 2,
        },
      ])
    })

    it('leaves out the slots before the given one', async () => {
      const posted = await repository.getPostedSince(101)

      expect(posted).toEqualUnsorted([
        { projectId: A, blobs: 4, batches: 2, lastSlot: 101, lastBlobs: 4 },
        { projectId: B, blobs: 6, batches: 1, lastSlot: 103, lastBlobs: 6 },
        {
          projectId: undefined,
          blobs: 2,
          batches: 1,
          lastSlot: 104,
          lastBlobs: 2,
        },
      ])
    })
  })

  describe(LiveBlobBatchRepository.prototype.getBucketsSince.name, () => {
    it("sums each project's blobs per bucket counted from genesis", async () => {
      // Buckets of two slots: 100-101 is bucket 50, 102-103 is 51, 104 is 52
      const buckets = await repository.getBucketsSince(101, 2)

      expect(buckets).toEqualUnsorted([
        { projectId: A, bucket: 50, blobs: 4 },
        { projectId: B, bucket: 51, blobs: 6 },
        { projectId: undefined, bucket: 52, blobs: 2 },
      ])
    })
  })

  describe(LiveBlobBatchRepository.prototype.deleteBeforeBlock.name, () => {
    it('deletes the batches of blocks older than the given one', async () => {
      const deleted = await repository.deleteBeforeBlock(blockOf(101))

      expect(deleted).toEqual(2)
      expect(await repository.getBySlotRange(0, 1000)).toEqual(BATCHES.slice(2))
    })
  })

  describe(LiveBlobBatchRepository.prototype.deleteAfterBlock.name, () => {
    it('deletes the batches of blocks newer than the given one', async () => {
      const deleted = await repository.deleteAfterBlock(blockOf(103))

      expect(deleted).toEqual(1)
      expect(await repository.getBySlotRange(0, 1000)).toEqual(
        BATCHES.slice(0, 5),
      )
    })
  })

  describe(LiveBlobBatchRepository.prototype.deleteAll.name, () => {
    it('deletes every batch', async () => {
      await repository.deleteAll()

      expect(await repository.getBySlotRange(0, 1000)).toEqual([])
    })
  })
})

function blockOf(slot: number) {
  return slot + 900
}

function batch(
  fields: Pick<LiveBlobBatchRecord, 'slot' | 'txIndex' | 'blobs'> &
    Partial<LiveBlobBatchRecord>,
): LiveBlobBatchRecord {
  return {
    blockNumber: blockOf(fields.slot),
    from: '0xfrom',
    to: '0xto',
    projectId: undefined,
    ...fields,
  }
}
