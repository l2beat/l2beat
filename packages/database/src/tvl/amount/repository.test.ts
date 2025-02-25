import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { testDeletingArchivedRecords } from '../../utils/deleteArchivedRecords.test'
import { AmountRepository } from './repository'

describeDatabase(AmountRepository.name, (db) => {
  const repository = db.amount

  describe(AmountRepository.prototype.getByIdsAndTimestamp.name, () => {
    it('gets by timestamp', async () => {
      await repository.insertMany([
        amount('a', new UnixTime(100), 1n),
        amount('b', new UnixTime(100), 1n),
        amount('c', new UnixTime(100), 1n),
        amount('a', new UnixTime(200), 2n),
        amount('b', new UnixTime(200), 2n),
        amount('c', new UnixTime(200), 2n),
        amount('d', new UnixTime(200), 2n),
      ])

      const configIds = ['a'.repeat(12), 'b'.repeat(12)]
      const result = await repository.getByIdsAndTimestamp(
        configIds,
        new UnixTime(200),
      )
      expect(result).toEqual([
        amount('a', new UnixTime(200), 2n),
        amount('b', new UnixTime(200), 2n),
      ])
    })
  })

  describe(AmountRepository.prototype.getByConfigIdsInRange.name, () => {
    it('gets by ids in inclusive range', async () => {
      await repository.insertMany([
        amount('a', new UnixTime(50), 100n),
        amount('a', new UnixTime(100), 100n),
        amount('b', new UnixTime(100), 100n),
        amount('c', new UnixTime(100), 100n),
        amount('a', new UnixTime(200), 100n),
        amount('b', new UnixTime(200), 100n),
        amount('c', new UnixTime(200), 100n),
        amount('a', new UnixTime(300), 100n),
        amount('b', new UnixTime(300), 100n),
        amount('c', new UnixTime(300), 100n),
        amount('a', new UnixTime(400), 100n),
      ])

      const result = await repository.getByConfigIdsInRange(
        ['a'.repeat(12), 'b'.repeat(12)],
        new UnixTime(100),
        new UnixTime(300),
      )

      expect(result).toEqual([
        amount('a', new UnixTime(100), 100n),
        amount('b', new UnixTime(100), 100n),
        amount('a', new UnixTime(200), 100n),
        amount('b', new UnixTime(200), 100n),
        amount('a', new UnixTime(300), 100n),
        amount('b', new UnixTime(300), 100n),
      ])
    })
  })

  describe(AmountRepository.prototype.getByTimestamps.name, () => {
    it('finds by config and timestamp', async () => {
      await repository.insertMany([
        amount('a', new UnixTime(100), 1n),
        amount('a', new UnixTime(200), 2n),
        amount('a', new UnixTime(300), 3n),
      ])
      const result = await repository.getByTimestamps([
        new UnixTime(100),
        new UnixTime(200),
      ])
      expect(result).toEqualUnsorted([
        amount('a', new UnixTime(100), 1n),
        amount('a', new UnixTime(200), 2n),
      ])
    })
  })

  describe(AmountRepository.prototype.getLatestAmount.name, () => {
    it('finds latest price for configurations', async () => {
      await repository.insertMany([
        amount('a', new UnixTime(100), 100n),
        amount('a', new UnixTime(200), 200n),

        amount('b', new UnixTime(100), 100n),
        amount('b', new UnixTime(200), 200n),
        amount('b', new UnixTime(300), 300n),

        amount('c', new UnixTime(100), 100n),
        amount('c', new UnixTime(200), 200n),
        amount('c', new UnixTime(300), 300n),
        amount('c', new UnixTime(400), 300n),
      ])

      const result = await repository.getLatestAmount('b'.repeat(12))

      expect(result).toEqual(amount('b', new UnixTime(300), 300n))
    })
  })

  describe(AmountRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      await repository.insertMany([
        amount('a', UnixTime.ZERO, 111n),
        amount('b', UnixTime.ZERO, 222n),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        amount('a', UnixTime.ZERO, 111n),
        amount('b', UnixTime.ZERO, 222n),
      ])
    })

    it('empty array', async () => {
      await expect(repository.insertMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 10k records', async () => {
      const records = []
      for (let i = 5; i < 15_000; i++) {
        records.push(amount('a', new UnixTime(i), 111n))
      }

      await expect(repository.insertMany(records)).not.toBeRejected()
    })
  })

  describe(AmountRepository.prototype.deleteByConfigInTimeRange.name, () => {
    it('deletes data in range for matching config', async () => {
      await repository.insertMany([
        amount('b', new UnixTime(1), 0n),
        amount('b', new UnixTime(2), 0n),
        amount('b', new UnixTime(3), 0n),
      ])

      await repository.deleteByConfigInTimeRange(
        'b'.repeat(12),
        new UnixTime(1),
        new UnixTime(2),
      )

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([amount('b', new UnixTime(3), 0n)])
    })
    it('does not delete data if matching config not found', async () => {
      await repository.insertMany([amount('b', new UnixTime(1), 0n)])

      await repository.deleteByConfigInTimeRange(
        'c',
        new UnixTime(1),
        new UnixTime(2),
      )

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([amount('b', new UnixTime(1), 0n)])
    })
  })

  describe(AmountRepository.prototype.deleteByConfigAfter.name, () => {
    it('deletes data in range for matching config', async () => {
      await repository.insertMany([
        amount('b', new UnixTime(1), 0n),
        amount('b', new UnixTime(2), 0n),
        amount('b', new UnixTime(3), 0n),
      ])

      await repository.deleteByConfigAfter('b'.repeat(12), new UnixTime(1))

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([amount('b', new UnixTime(1), 0n)])
    })

    it('does not delete data if matching config not found', async () => {
      await repository.insertMany([amount('b', new UnixTime(2), 0n)])

      await repository.deleteByConfigAfter('c', new UnixTime(1))

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([amount('b', new UnixTime(2), 0n)])
    })
  })

  // TvlCleaner test
  testDeletingArchivedRecords(repository, (timestamp) =>
    amount('a', timestamp, 0n),
  )

  // #region methods used only in tests
  it(AmountRepository.prototype.deleteAll.name, async () => {
    await repository.insertMany([amount('a', UnixTime.ZERO, 111n)])
    await repository.deleteAll()
    const results = await repository.getAll()
    expect(results).toEqual([])
  })
  // #endregion

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function amount(configId: string, timestamp: UnixTime, amount: bigint) {
  return {
    configId: configId.repeat(12),
    timestamp,
    amount,
  }
}
