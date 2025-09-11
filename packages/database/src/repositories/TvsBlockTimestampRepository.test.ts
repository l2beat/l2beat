import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { TvsBlockTimestampRepository } from './TvsBlockTimestampRepository'

describeDatabase(TvsBlockTimestampRepository.name, (db) => {
  const repository = db.tvsBlockTimestamp

  describe(TvsBlockTimestampRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        blockTimestamp('a', 'ethereum', UnixTime(100), 1000),
        blockTimestamp('b', 'arbitrum', UnixTime(200), 2000),
      ]

      await repository.insertMany(records)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      const inserted = await repository.insertMany([])
      expect(inserted).toEqual(0)
    })

    it('performs batch insert when more than 1000 records', async () => {
      const records = []
      for (let i = 0; i < 1500; i++) {
        records.push(blockTimestamp('a', 'ethereum', UnixTime(i), i + 1000))
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(1500)
    })
  })

  describe(
    TvsBlockTimestampRepository.prototype.findBlockNumberByChainAndTimestamp
      .name,
    () => {
      it('finds block number for given chain and timestamp', async () => {
        await repository.insertMany([
          blockTimestamp('a', 'ethereum', UnixTime(100), 1000),
          blockTimestamp('b', 'arbitrum', UnixTime(100), 2000),
          blockTimestamp('a', 'ethereum', UnixTime(200), 3000),
        ])

        const result = await repository.findBlockNumberByChainAndTimestamp(
          'ethereum',
          UnixTime(100),
        )

        expect(result).toEqual(1000)
      })

      it('returns undefined when no matching record exists', async () => {
        await repository.insertMany([
          blockTimestamp('a', 'ethereum', UnixTime(100), 1000),
        ])

        const result = await repository.findBlockNumberByChainAndTimestamp(
          'ethereum',
          UnixTime(200),
        )

        expect(result).toEqual(undefined)
      })
    },
  )

  describe(
    TvsBlockTimestampRepository.prototype.deleteByConfigInTimeRange.name,
    () => {
      it('deletes data in range for matching config', async () => {
        await repository.insertMany([
          blockTimestamp('b', 'ethereum', UnixTime(1), 1001),
          blockTimestamp('b', 'ethereum', UnixTime(2), 1002),
          blockTimestamp('b', 'ethereum', UnixTime(3), 1003),
          blockTimestamp('c', 'arbitrum', UnixTime(2), 2002),
        ])

        const deleted = await repository.deleteByConfigInTimeRange(
          'b'.repeat(12),
          UnixTime(1),
          UnixTime(2),
        )

        expect(deleted).toEqual(2)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          blockTimestamp('b', 'ethereum', UnixTime(3), 1003),
          blockTimestamp('c', 'arbitrum', UnixTime(2), 2002),
        ])
      })

      it('returns 0 if no matching config found', async () => {
        await repository.insertMany([
          blockTimestamp('b', 'ethereum', UnixTime(1), 1001),
        ])

        const deleted = await repository.deleteByConfigInTimeRange(
          'c'.repeat(12),
          UnixTime(1),
          UnixTime(2),
        )

        expect(deleted).toEqual(0)

        const results = await repository.getAll()
        expect(results).toEqualUnsorted([
          blockTimestamp('b', 'ethereum', UnixTime(1), 1001),
        ])
      })
    },
  )

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function blockTimestamp(
  configId: string,
  chain: string,
  timestamp: UnixTime,
  blockNumber: number,
) {
  return {
    configurationId: configId.repeat(12),
    chain,
    timestamp,
    blockNumber,
  }
}
