import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import type { LiveBlobBatchRecord } from './LiveBlobBatchRepository'
import {
  type LivePendingBlobTxRecord,
  LivePendingBlobTxRepository,
} from './LivePendingBlobTxRepository'

describeDatabase(LivePendingBlobTxRepository.name, (db) => {
  const repository = db.livePendingBlobTx

  beforeEach(async () => {
    await repository.deleteAll()
    await db.liveBlobBatch.deleteAll()
  })

  describe(LivePendingBlobTxRepository.prototype.upsert.name, () => {
    it('keeps when a resent batch was first heard of', async () => {
      await repository.upsert(tx({ nonce: 1, firstSeenAt: 10.25 }))
      const resent = tx({
        nonce: 1,
        txHash: '0xbumped',
        blobs: 3,
        projectId: ProjectId('a'),
        firstSeenAt: 12,
        lastSeenAt: 12.5,
      })

      await repository.upsert(resent)

      expect(await repository.getWaiting(10)).toEqual([
        { ...resent, firstSeenAt: 10.25 },
      ])
    })
  })

  describe(LivePendingBlobTxRepository.prototype.getWaiting.name, () => {
    it('leaves out the ones a block took, by that nonce or a higher one', async () => {
      await repository.upsert(tx({ from: '0xa', nonce: 1 }))
      await repository.upsert(tx({ from: '0xa', nonce: 2 }))
      await repository.upsert(tx({ from: '0xa', nonce: 4 }))
      await repository.upsert(tx({ from: '0xb', nonce: 1 }))
      await db.liveBlobBatch.upsertMany([batch({ from: '0xa', nonce: 2 })])

      const waiting = await repository.getWaiting(10)

      expect(waiting.map((t) => `${t.from}:${t.nonce}`)).toEqual([
        '0xb:1',
        '0xa:4',
      ])
    })

    it('returns the newest, oldest first', async () => {
      await repository.upsert(tx({ nonce: 1, firstSeenAt: 1, lastSeenAt: 1 }))
      await repository.upsert(tx({ nonce: 2, firstSeenAt: 2, lastSeenAt: 2 }))
      await repository.upsert(tx({ nonce: 3, firstSeenAt: 3, lastSeenAt: 3 }))
      await repository.upsert(tx({ nonce: 4, firstSeenAt: 4, lastSeenAt: 4 }))

      const waiting = await repository.getWaiting(2)

      expect(waiting.map((t) => t.nonce)).toEqual([3, 4])
    })
  })

  describe(LivePendingBlobTxRepository.prototype.getChangeMark.name, () => {
    it('changes as a batch is heard of again and as one is deleted', async () => {
      await repository.upsert(tx({ nonce: 1, lastSeenAt: 1 }))
      await repository.upsert(tx({ nonce: 2, lastSeenAt: 2 }))
      const first = await repository.getChangeMark()

      await repository.upsert(tx({ nonce: 1, lastSeenAt: 3 }))
      const heard = await repository.getChangeMark()
      await repository.deleteSeenBefore(3)
      const deleted = await repository.getChangeMark()

      expect(new Set([first, heard, deleted]).size).toEqual(3)
    })
  })

  describe(LivePendingBlobTxRepository.prototype.getFirstSeen.name, () => {
    it('tells when each batch heard of was first heard of', async () => {
      await repository.upsert(tx({ from: '0xa', nonce: 1, firstSeenAt: 7.5 }))
      await repository.upsert(tx({ from: '0xb', nonce: 1, firstSeenAt: 8 }))

      const firstSeen = await repository.getFirstSeen([
        { from: '0xa', nonce: 1 },
        { from: '0xa', nonce: 2 },
      ])

      expect([...firstSeen]).toEqual([['0xa:1', 7.5]])
    })
  })

  describe(LivePendingBlobTxRepository.prototype.deleteSeenBefore.name, () => {
    it('deletes the ones last heard of before the time', async () => {
      await repository.upsert(tx({ nonce: 1, lastSeenAt: 1 }))
      await repository.upsert(tx({ nonce: 2, lastSeenAt: 2 }))

      expect(await repository.deleteSeenBefore(2)).toEqual(1)
      expect((await repository.getWaiting(10)).map((t) => t.nonce)).toEqual([2])
    })
  })
})

function tx(
  fields: Pick<LivePendingBlobTxRecord, 'nonce'> &
    Partial<LivePendingBlobTxRecord>,
): LivePendingBlobTxRecord {
  const firstSeenAt = fields.firstSeenAt ?? fields.nonce
  return {
    from: '0xfrom',
    txHash: `0x${fields.from ?? 'from'}${fields.nonce}`,
    to: '0xto',
    blobs: 1,
    projectId: undefined,
    firstSeenAt,
    lastSeenAt: firstSeenAt,
    ...fields,
  }
}

function batch(
  fields: Pick<LiveBlobBatchRecord, 'from' | 'nonce'>,
): LiveBlobBatchRecord {
  return {
    slot: 100,
    txIndex: 0,
    txHash: '0xincluded',
    blockNumber: 1000,
    to: '0xto',
    blobs: 1,
    topics: [],
    projectId: undefined,
    pendingSince: undefined,
    ...fields,
  }
}
