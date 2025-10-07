import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropRecentPricesRecord,
  InteropRecentPricesRepository,
} from './InteropRecentPricesRepository'

describeDatabase(InteropRecentPricesRepository.name, (database) => {
  const repository = database.interopRecentPrices

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(InteropRecentPricesRepository.prototype.getAll.name, () => {
    it('returns all records', async () => {
      const records = [
        mock('bitcoin', UnixTime.fromDate(new Date('2023-01-01')), 30000),
        mock('ethereum', UnixTime.fromDate(new Date('2023-01-01')), 2000),
      ]

      await repository.insertMany(records)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted([
        saved('bitcoin', UnixTime.fromDate(new Date('2023-01-01')), 30000),
        saved('ethereum', UnixTime.fromDate(new Date('2023-01-01')), 2000),
      ])
    })

    it('returns empty array when no records exist', async () => {
      const result = await repository.getAll()
      expect(result).toEqual([])
    })
  })

  describe(InteropRecentPricesRepository.prototype.insertMany.name, () => {
    it('inserts multiple records', async () => {
      const records = [
        mock('bitcoin', UnixTime.fromDate(new Date('2023-01-01')), 30000),
        mock('ethereum', UnixTime.fromDate(new Date('2023-01-01')), 2000),
      ]

      const count = await repository.insertMany(records)

      expect(count).toEqual(2)
      const result = await repository.getAll()
      expect(result).toEqualUnsorted([
        saved('bitcoin', UnixTime.fromDate(new Date('2023-01-01')), 30000),
        saved('ethereum', UnixTime.fromDate(new Date('2023-01-01')), 2000),
      ])
    })

    it('returns 0 for empty array', async () => {
      const count = await repository.insertMany([])
      expect(count).toEqual(0)
    })

    it('performs batch insert when more than 10,000 records', async () => {
      const records = []
      for (let i = 0; i < 15000; i++) {
        records.push(
          mock(
            `bitcoin-${i}`,
            UnixTime.fromDate(
              new Date(
                `2023-01-01T${String(i % 24).padStart(2, '0')}:00:00.000Z`,
              ),
            ),
            30000 + i,
          ),
        )
      }

      const count = await repository.insertMany(records)
      expect(count).toEqual(15000)

      const result = await repository.getAll()
      expect(result).toHaveLength(15000)
    })
  })

  describe(InteropRecentPricesRepository.prototype.deleteAll.name, () => {
    it('deletes all records and returns count', async () => {
      const records = [
        mock('bitcoin', UnixTime.fromDate(new Date('2023-01-01')), 30000),
        mock('ethereum', UnixTime.fromDate(new Date('2023-01-01')), 2000),
      ]

      await repository.insertMany(records)

      const deletedCount = await repository.deleteAll()
      expect(deletedCount).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqual([])
    })

    it('returns 0 when no records exist', async () => {
      const deletedCount = await repository.deleteAll()
      expect(deletedCount).toEqual(0)
    })
  })
})

function mock(
  coingeckoId: string,
  timestamp: UnixTime,
  priceUsd: number,
): InteropRecentPricesRecord {
  return { coingeckoId, timestamp, priceUsd }
}

function saved(
  coingeckoId: string,
  timestamp: UnixTime,
  priceUsd: number,
): InteropRecentPricesRecord {
  return { coingeckoId, timestamp, priceUsd }
}
