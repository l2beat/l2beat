import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type ChainBlockRecord,
  ChainBlockRepository,
} from './ChainBlockRepository'

describeDatabase(ChainBlockRepository.name, (db) => {
  const repository = db.chainBlock
  const START = UnixTime.toStartOf(UnixTime.now(), 'hour')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(ChainBlockRepository.prototype.upsertMany.name, () => {
    it('replaces a block fetched again after a reorg', async () => {
      await repository.upsertMany([block('base', 1), block('base', 2)])
      const replaced = { ...block('base', 2), hash: '0xother' }

      await repository.upsertMany([replaced])

      expect(await repository.getNewest('base', 10)).toEqual([
        block('base', 1),
        replaced,
      ])
    })
  })

  describe(ChainBlockRepository.prototype.getNewest.name, () => {
    it("returns the chain's newest blocks, oldest first", async () => {
      await repository.upsertMany([
        block('base', 1),
        block('base', 2),
        block('base', 3),
        block('ethereum', 4),
      ])

      expect(await repository.getNewest('base', 2)).toEqual([
        block('base', 2),
        block('base', 3),
      ])
    })
  })

  describe(ChainBlockRepository.prototype.getByNumberRange.name, () => {
    it("returns the chain's blocks in the range, both ends included", async () => {
      await repository.upsertMany([
        block('base', 1),
        block('base', 2),
        block('base', 3),
        block('ethereum', 2),
      ])

      expect(await repository.getByNumberRange('base', 2, 3)).toEqual([
        block('base', 2),
        block('base', 3),
      ])
    })
  })

  describe(ChainBlockRepository.prototype.deleteAfter.name, () => {
    it("deletes the chain's blocks above the number", async () => {
      await repository.upsertMany([
        block('base', 1),
        block('base', 2),
        block('ethereum', 2),
      ])

      expect(await repository.deleteAfter('base', 1)).toEqual(1)

      expect(await repository.getNewest('base', 10)).toEqual([block('base', 1)])
      expect(await repository.getNewest('ethereum', 10)).toEqual([
        block('ethereum', 2),
      ])
    })
  })

  describe(ChainBlockRepository.prototype.deleteByChain.name, () => {
    it('deletes every block of the chain and of no other', async () => {
      await repository.upsertMany([block('base', 1), block('ethereum', 1)])

      expect(await repository.deleteByChain('base')).toEqual(1)

      expect(await repository.getNewest('base', 10)).toEqual([])
      expect(await repository.getNewest('ethereum', 10)).toEqual([
        block('ethereum', 1),
      ])
    })
  })

  describe(ChainBlockRepository.prototype.deleteBefore.name, () => {
    it("deletes the chain's blocks older than the timestamp", async () => {
      await repository.upsertMany([
        block('base', 1),
        block('base', 2),
        block('ethereum', 1),
      ])

      expect(await repository.deleteBefore('base', START + 2)).toEqual(1)

      expect(await repository.getNewest('base', 10)).toEqual([block('base', 2)])
      expect(await repository.getNewest('ethereum', 10)).toEqual([
        block('ethereum', 1),
      ])
    })
  })

  function block(chain: string, number: number): ChainBlockRecord {
    return {
      chain,
      number,
      hash: `0x${number}`,
      parentHash: `0x${number - 1}`,
      timestamp: START + number,
      logsBloom: `0xbloom${number}`,
    }
  }
})
