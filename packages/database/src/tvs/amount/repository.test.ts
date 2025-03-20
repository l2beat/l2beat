import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { TvsAmountRepository } from './repository'

describeDatabase(TvsAmountRepository.name, (db) => {
  const repository = db.tvsAmount

  describe(TvsAmountRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        tvsAmount('a', 'project1', UnixTime(100), 1n),
        tvsAmount('b', 'project2', UnixTime(100), 2n),
      ]

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(2)

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
        records.push(tvsAmount('a', 'project1', UnixTime(i), BigInt(i)))
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(1500)
    })
  })

  describe(TvsAmountRepository.prototype.getAmountsInRange.name, () => {
    it('gets amounts for given configIds in time range', async () => {
      await repository.insertMany([
        tvsAmount('a', 'project1', UnixTime(50), 0n),
        tvsAmount('a', 'project1', UnixTime(100), 1n),
        tvsAmount('b', 'project1', UnixTime(100), 2n),
        tvsAmount('a', 'project1', UnixTime(200), 3n),
        tvsAmount('b', 'project1', UnixTime(200), 4n),
        tvsAmount('c', 'project2', UnixTime(100), 5n),
        tvsAmount('c', 'project2', UnixTime(200), 6n),
        tvsAmount('a', 'project1', UnixTime(300), 7n),
      ])

      const configIds = ['a'.repeat(12), 'b'.repeat(12)]

      const result = await repository.getAmountsInRange(
        configIds,
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqualUnsorted([
        tvsAmount('a', 'project1', UnixTime(100), 1n),
        tvsAmount('b', 'project1', UnixTime(100), 2n),
        tvsAmount('a', 'project1', UnixTime(200), 3n),
        tvsAmount('b', 'project1', UnixTime(200), 4n),
      ])
    })

    it('returns empty array when no data in range', async () => {
      await repository.insertMany([
        tvsAmount('a', 'project1', UnixTime(50), 0n),
        tvsAmount('a', 'project1', UnixTime(300), 7n),
      ])

      const configIds = ['a'.repeat(12)]

      const result = await repository.getAmountsInRange(
        configIds,
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqual([])
    })

    it('returns empty array when no matching configIds', async () => {
      await repository.insertMany([
        tvsAmount('a', 'project1', UnixTime(100), 1n),
      ])

      const configIds = ['b'.repeat(12)]

      const result = await repository.getAmountsInRange(
        configIds,
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqual([])
    })
  })

  describe(TvsAmountRepository.prototype.getLatestAmount.name, () => {
    it('returns the latest amount for a configuration', async () => {
      await repository.insertMany([
        tvsAmount('a', 'project1', UnixTime(100), 1n),
        tvsAmount('a', 'project1', UnixTime(200), 2n),
        tvsAmount('a', 'project1', UnixTime(50), 0n),
        tvsAmount('b', 'project1', UnixTime(150), 3n),
      ])

      const result = await repository.getLatestAmount('a'.repeat(12))

      expect(result).toEqual(tvsAmount('a', 'project1', UnixTime(200), 2n))
    })

    it('returns undefined when no amounts exist for the configuration', async () => {
      await repository.insertMany([
        tvsAmount('a', 'project1', UnixTime(100), 1n),
      ])

      const result = await repository.getLatestAmount('b'.repeat(12))

      expect(result).toEqual(undefined)
    })

    it('returns the correct result when multiple projects exist', async () => {
      await repository.insertMany([
        tvsAmount('a', 'project1', UnixTime(100), 1n),
        tvsAmount('b', 'project2', UnixTime(200), 2n),
        tvsAmount('a', 'project1', UnixTime(300), 3n),
        tvsAmount('b', 'project2', UnixTime(150), 4n),
      ])

      const resultA = await repository.getLatestAmount('a'.repeat(12))
      const resultB = await repository.getLatestAmount('b'.repeat(12))

      expect(resultA).toEqual(tvsAmount('a', 'project1', UnixTime(300), 3n))
      expect(resultB).toEqual(tvsAmount('b', 'project2', UnixTime(200), 2n))
    })
  })

  describe(TvsAmountRepository.prototype.deleteByConfigInTimeRange.name, () => {
    it('deletes data in range for matching config', async () => {
      await repository.insertMany([
        tvsAmount('b', 'project1', UnixTime(1), 1n),
        tvsAmount('b', 'project1', UnixTime(2), 2n),
        tvsAmount('b', 'project1', UnixTime(3), 3n),
        tvsAmount('c', 'project2', UnixTime(2), 4n),
      ])

      const deleted = await repository.deleteByConfigInTimeRange(
        'b'.repeat(12),
        UnixTime(1),
        UnixTime(2),
      )

      expect(deleted).toEqual(2)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        tvsAmount('b', 'project1', UnixTime(3), 3n),
        tvsAmount('c', 'project2', UnixTime(2), 4n),
      ])
    })

    it('returns 0 if no matching config found', async () => {
      await repository.insertMany([tvsAmount('b', 'project1', UnixTime(1), 1n)])

      const deleted = await repository.deleteByConfigInTimeRange(
        'c'.repeat(12),
        UnixTime(1),
        UnixTime(2),
      )

      expect(deleted).toEqual(0)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        tvsAmount('b', 'project1', UnixTime(1), 1n),
      ])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function tvsAmount(
  configId: string,
  project: string,
  timestamp: UnixTime,
  amount: bigint,
) {
  return {
    configurationId: configId.repeat(12),
    project,
    timestamp,
    amount,
  }
}
