import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type ChainHeadCursorRecord,
  ChainHeadCursorRepository,
} from './ChainHeadCursorRepository'

describeDatabase(ChainHeadCursorRepository.name, (db) => {
  const repository = db.chainHeadCursor
  const START = UnixTime.toStartOf(UnixTime.now(), 'hour')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(ChainHeadCursorRepository.prototype.upsert.name, () => {
    it("replaces the indexer's cursor and no other", async () => {
      await repository.upsert(cursor('a', 10))
      await repository.upsert(cursor('b', 10))
      const moved = { ...cursor('a', 12), sinceNumber: 11 }

      await repository.upsert(moved)

      expect(await repository.findByIndexerId('a')).toEqual(moved)
      expect(await repository.findByIndexerId('b')).toEqual(cursor('b', 10))
    })
  })

  describe(ChainHeadCursorRepository.prototype.deleteByIndexerIds.name, () => {
    it('deletes the cursors of the given indexers', async () => {
      await repository.upsert(cursor('a', 10))
      await repository.upsert(cursor('b', 10))
      await repository.upsert(cursor('c', 10))

      expect(await repository.deleteByIndexerIds(['a', 'c'])).toEqual(2)

      expect(await repository.getAll()).toEqual([cursor('b', 10)])
    })
  })

  function cursor(indexerId: string, number: number): ChainHeadCursorRecord {
    return {
      indexerId,
      chain: 'base',
      sinceNumber: 5,
      sinceTimestamp: START + 5,
      startedAt: START,
      number,
      hash: `0x${number}`,
      timestamp: START + number,
    }
  }
})
