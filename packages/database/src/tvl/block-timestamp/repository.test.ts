import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { testDeletingArchivedRecords } from '../../utils/deleteArchivedRecords.test'
import { BlockTimestampRepository } from './repository'

describeDatabase(BlockTimestampRepository.name, (db) => {
  const repository = db.blockTimestamp

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(BlockTimestampRepository.prototype.insert.name, () => {
    it('adds new row', async () => {
      const newRow = {
        chain: 'chain',
        timestamp: UnixTime.ZERO,
        blockNumber: 0,
      }

      await repository.insert(newRow)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([newRow])
    })
  })

  describe(BlockTimestampRepository.prototype.findBlockNumberByChainAndTimestamp
    .name, () => {
    it('finds block number by chain and timestamp', async () => {
      const blocks = [
        {
          chain: 'chain',
          timestamp: new UnixTime(1),
          blockNumber: 123,
        },
        {
          chain: 'chain',
          timestamp: new UnixTime(2),
          blockNumber: 2,
        },
        {
          chain: 'chain-2',
          timestamp: new UnixTime(1),
          blockNumber: 1,
        },
      ]
      await Promise.all(blocks.map((b) => repository.insert(b)))

      const blockNumber = await repository.findBlockNumberByChainAndTimestamp(
        'chain',
        new UnixTime(1),
      )

      expect(blockNumber).toEqual(123)
    })
  })

  describe(BlockTimestampRepository.prototype.deleteAfterExclusive.name, () => {
    it('deletes all records after the given timestamp', async () => {
      const blocks = [
        {
          chain: 'chain',
          timestamp: new UnixTime(1),
          blockNumber: 1,
        },
        {
          chain: 'chain',
          timestamp: new UnixTime(2),
          blockNumber: 2,
        },
        {
          chain: 'chain-2',
          timestamp: new UnixTime(1),
          blockNumber: 1,
        },
      ]
      await Promise.all(blocks.map((b) => repository.insert(b)))

      await repository.deleteAfterExclusive('chain', new UnixTime(1))

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([blocks[0]!, blocks[2]!])
    })
  })

  it(BlockTimestampRepository.prototype.deleteAll.name, async () => {
    await repository.insert({
      chain: 'chain',
      timestamp: UnixTime.ZERO,
      blockNumber: 0,
    })

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })

  // TvlCleaner test
  testDeletingArchivedRecords(repository, (timestamp) => ({
    chain: 'chain',
    timestamp,
    blockNumber: 0,
  }))
})
