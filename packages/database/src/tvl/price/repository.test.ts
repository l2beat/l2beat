import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { testDeletingArchivedRecords } from '../../utils/deleteArchivedRecords.test'
import type { PriceRecord } from './entity'
import { PriceRepository } from './repository'

describeDatabase(PriceRepository.name, (db) => {
  const repository = db.price

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(PriceRepository.prototype.getByTimestamp.name, () => {
    it('gets by timestamp', async () => {
      await repository.insertMany([
        saved('a', new UnixTime(100), 1),
        saved('b', new UnixTime(100), 1),
        saved('a', new UnixTime(200), 2),
        saved('b', new UnixTime(200), 2),
      ])
      const result = await repository.getByTimestamp(new UnixTime(200))
      expect(result).toEqual([
        saved('a', new UnixTime(200), 2),
        saved('b', new UnixTime(200), 2),
      ])
    })
  })

  describe(PriceRepository.prototype.getByConfigIdsInRange.name, () => {
    it('gets by ids in inclusive range', async () => {
      await repository.insertMany([
        saved('a', new UnixTime(50), 100),
        saved('a', new UnixTime(100), 100),
        saved('b', new UnixTime(100), 100),
        saved('c', new UnixTime(100), 100),
        saved('a', new UnixTime(200), 100),
        saved('b', new UnixTime(200), 100),
        saved('c', new UnixTime(200), 100),
        saved('a', new UnixTime(300), 100),
        saved('b', new UnixTime(300), 100),
        saved('c', new UnixTime(300), 100),
        saved('a', new UnixTime(400), 100),
      ])

      const result = await repository.getByConfigIdsInRange(
        ['a'.repeat(12), 'b'.repeat(12)],
        new UnixTime(100),
        new UnixTime(300),
      )

      expect(result).toEqual([
        saved('a', new UnixTime(100), 100),
        saved('b', new UnixTime(100), 100),
        saved('a', new UnixTime(200), 100),
        saved('b', new UnixTime(200), 100),
        saved('a', new UnixTime(300), 100),
        saved('b', new UnixTime(300), 100),
      ])
    })
  })

  describe(PriceRepository.prototype.getLatestPrice.name, () => {
    it('finds latest price for configurations', async () => {
      await repository.insertMany([
        saved('a', new UnixTime(100), 100),
        saved('a', new UnixTime(200), 200),

        saved('b', new UnixTime(100), 100),
        saved('b', new UnixTime(200), 200),
        saved('b', new UnixTime(300), 300),

        saved('c', new UnixTime(100), 100),
        saved('c', new UnixTime(200), 200),
        saved('c', new UnixTime(300), 300),
        saved('c', new UnixTime(400), 300),
      ])

      const result = await repository.getLatestPrice([
        'a'.repeat(12),
        'b'.repeat(12),
      ])

      expect(result).toEqual(saved('b', new UnixTime(300), 300))
    })
  })

  describe(PriceRepository.prototype.findByConfigAndTimestamp.name, () => {
    it('finds by config and timestamp', async () => {
      await repository.insertMany([
        saved('a', new UnixTime(100), 1),
        saved('b', new UnixTime(100), 1),
        saved('a', new UnixTime(200), 2),
        saved('b', new UnixTime(200), 2),
      ])
      const result = await repository.findByConfigAndTimestamp(
        'a'.repeat(12),
        new UnixTime(200),
      )
      expect(result).toEqual(saved('a', new UnixTime(200), 2))
    })
  })

  describe(PriceRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      await repository.insertMany([
        saved('a', UnixTime.ZERO, 1),
        saved('b', UnixTime.ZERO, 2),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        saved('a', UnixTime.ZERO, 1),
        saved('b', UnixTime.ZERO, 2),
      ])
    })

    it('empty array', async () => {
      await expect(repository.insertMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 10k records', async () => {
      const records: PriceRecord[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push(saved('a', new UnixTime(i), i))
      }
      await expect(repository.insertMany(records)).not.toBeRejected()
    })
  })

  describe(PriceRepository.prototype.deleteByConfigInTimeRange.name, () => {
    it('deletes records after the given timestamp', async () => {
      await repository.insertMany([
        saved('a', new UnixTime(1), 1),
        saved('a', new UnixTime(2), 2),
        saved('a', new UnixTime(3), 3),
      ])

      await repository.deleteByConfigInTimeRange(
        'a'.repeat(12),
        new UnixTime(2),
        new UnixTime(3),
      )

      const results = await repository.getAll()
      expect(results).toEqual([saved('a', new UnixTime(1), 1)])
    })

    it('deletes only for specified ids', async () => {
      await repository.insertMany([
        saved('a', new UnixTime(1), 1),
        saved('b', new UnixTime(1), 1),
      ])

      await repository.deleteByConfigInTimeRange(
        'a'.repeat(12),
        new UnixTime(0),
        new UnixTime(1),
      )

      const results = await repository.getAll()
      expect(results).toEqual([saved('b', new UnixTime(1), 1)])
    })
  })

  it(PriceRepository.prototype.deleteAll.name, async () => {
    await repository.insertMany([saved('a', UnixTime.ZERO, 1)])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })

  // TvlCleaner test
  testDeletingArchivedRecords(repository, (timestamp) =>
    saved('a', timestamp, 1),
  )
})

function saved(id: string, timestamp: UnixTime, priceUsd: number): PriceRecord {
  return {
    configId: id.repeat(12),
    timestamp,
    priceUsd,
  }
}
