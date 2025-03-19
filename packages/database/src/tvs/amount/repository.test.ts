import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { TvsAmountRepository } from './repository'

describeDatabase(TvsAmountRepository.name, (db) => {
  const repository = db.tvsAmount

  describe(TvsAmountRepository.prototype.getAmounts.name, () => {
    it('gets amounts for given configIds and timestamps', async () => {
      await repository.insertMany([
        tvsAmount('a', 'project1', UnixTime(100), 1n),
        tvsAmount('b', 'project1', UnixTime(100), 2n),
        tvsAmount('a', 'project1', UnixTime(200), 3n),
        tvsAmount('b', 'project1', UnixTime(200), 4n),
        tvsAmount('c', 'project2', UnixTime(100), 5n),
        tvsAmount('c', 'project2', UnixTime(200), 6n),
      ])

      const configIds = ['a'.repeat(12), 'b'.repeat(12)]
      const timestamps = [UnixTime(100), UnixTime(200)]

      const result = await repository.getAmounts(configIds, timestamps)

      expect(result.size).toEqual(2)
      expect(result.get(UnixTime(100))?.get('a'.repeat(12))).toEqual(1n)
      expect(result.get(UnixTime(100))?.get('b'.repeat(12))).toEqual(2n)
      expect(result.get(UnixTime(200))?.get('a'.repeat(12))).toEqual(3n)
      expect(result.get(UnixTime(200))?.get('b'.repeat(12))).toEqual(4n)
    })

    it('returns empty maps for timestamps with no data', async () => {
      await repository.insertMany([
        tvsAmount('a', 'project1', UnixTime(100), 1n),
      ])

      const configIds = ['a'.repeat(12)]
      const timestamps = [UnixTime(100), UnixTime(200)]

      const result = await repository.getAmounts(configIds, timestamps)

      expect(result.size).toEqual(2)
      expect(result.get(UnixTime(100))?.get('a'.repeat(12))).toEqual(1n)
      expect(result.get(UnixTime(200))?.size).toEqual(0)
    })
  })

  describe(TvsAmountRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        tvsAmount('a', 'project1', UnixTime(100), 111n),
        tvsAmount('b', 'project2', UnixTime(100), 222n),
      ]

      await repository.insertMany(records)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      await expect(repository.insertMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 1000 records', async () => {
      const records = []
      for (let i = 0; i < 1500; i++) {
        records.push(tvsAmount('a', 'project1', UnixTime(i), 111n))
      }

      await expect(repository.insertMany(records)).not.toBeRejected()
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

  afterEach(async () => {
    await repository.deleteAll()
  })
})
