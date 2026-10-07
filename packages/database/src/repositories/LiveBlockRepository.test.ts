import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type LiveBlockRecord,
  LiveBlockRepository,
} from './LiveBlockRepository'

describeDatabase(LiveBlockRepository.name, (db) => {
  const repository = db.liveBlock

  // Slot 103 was missed: blocks 1000-1003 sit in slots 100-102 and 104
  const BLOCKS = [
    block(100, 1000),
    block(101, 1001),
    block(102, 1002),
    block(104, 1003),
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.upsertMany(BLOCKS)
  })

  describe(LiveBlockRepository.prototype.upsertMany.name, () => {
    it('replaces the block of a slot fetched again', async () => {
      const refetched = { ...block(104, 1003), hash: '0xother', blobCount: 6 }

      await repository.upsertMany([refetched])

      expect(await repository.getAll()).toEqual([
        ...BLOCKS.slice(0, 3),
        refetched,
      ])
    })
  })

  describe(LiveBlockRepository.prototype.findHead.name, () => {
    it('returns the block of the newest slot', async () => {
      expect(await repository.findHead()).toEqual(block(104, 1003))
    })

    it('returns undefined when empty', async () => {
      await repository.deleteAll()

      expect(await repository.findHead()).toEqual(undefined)
    })
  })

  describe(LiveBlockRepository.prototype.getSlotRange.name, () => {
    it('returns the oldest and newest slot and the blocks between', async () => {
      expect(await repository.getSlotRange()).toEqual({
        from: 100,
        to: 104,
        blocks: 4,
      })
    })

    it('counts only from the given slot', async () => {
      expect(await repository.getSlotRange(102)).toEqual({
        from: 102,
        to: 104,
        blocks: 2,
      })
    })

    it('returns undefined when no block is that new', async () => {
      expect(await repository.getSlotRange(105)).toEqual(undefined)
    })
  })

  describe(LiveBlockRepository.prototype.getBySlotRange.name, () => {
    it('returns the blocks of the slots, both ends included', async () => {
      expect(await repository.getBySlotRange(101, 104)).toEqual(BLOCKS.slice(1))
    })
  })

  describe(LiveBlockRepository.prototype.getByBlockNumberRange.name, () => {
    it('returns the blocks of the numbers, both ends included', async () => {
      expect(await repository.getByBlockNumberRange(1001, 1002)).toEqual(
        BLOCKS.slice(1, 3),
      )
    })
  })

  describe(LiveBlockRepository.prototype.deleteBeforeBlock.name, () => {
    it('deletes the blocks older than the given one', async () => {
      const deleted = await repository.deleteBeforeBlock(1002)

      expect(deleted).toEqual(2)
      expect(await repository.getAll()).toEqual(BLOCKS.slice(2))
    })
  })

  describe(LiveBlockRepository.prototype.deleteAfterBlock.name, () => {
    it('deletes the blocks newer than the given one', async () => {
      const deleted = await repository.deleteAfterBlock(1001)

      expect(deleted).toEqual(2)
      expect(await repository.getAll()).toEqual(BLOCKS.slice(0, 2))
    })
  })

  describe(LiveBlockRepository.prototype.deleteAll.name, () => {
    it('deletes every block', async () => {
      await repository.deleteAll()

      expect(await repository.getAll()).toEqual([])
    })
  })
})

function block(slot: number, blockNumber: number): LiveBlockRecord {
  return {
    slot,
    blockNumber,
    hash: `0x${blockNumber.toString(16)}`,
    timestamp: UnixTime(1_700_000_000 + slot * 12),
    blobCount: slot % 7,
  }
}
