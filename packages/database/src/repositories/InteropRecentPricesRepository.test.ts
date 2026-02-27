import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type InteropClosestPriceQuery,
  type InteropRecentPricesRecord,
  InteropRecentPricesRepository,
} from './InteropRecentPricesRepository'

describeDatabase(InteropRecentPricesRepository.name, (database) => {
  const repository = database.interopRecentPrices

  describe(InteropRecentPricesRepository.prototype.insertMany.name, () => {
    it('inserts multiple records', async () => {
      const records = [
        mock('bitcoin', UnixTime(100)),
        mock('ethereum', UnixTime(100)),
      ]

      const count = await repository.insertMany(records)

      expect(count).toEqual(2)
      const result = await repository.getAll()
      expect(result).toEqualUnsorted([
        saved('bitcoin', UnixTime(100), 1000),
        saved('ethereum', UnixTime(100), 1000),
      ])
    })

    it('performs batch insert when more than 10,000 records', async () => {
      const records = []
      for (let i = 0; i < 15000; i++) {
        records.push(mock('bitcoin', UnixTime(i)))
      }

      const count = await repository.insertMany(records)
      expect(count).toEqual(15000)

      const result = await repository.getAll()
      expect(result).toHaveLength(15000)
    })

    it('returns 0 for empty array', async () => {
      const count = await repository.insertMany([])
      expect(count).toEqual(0)
    })
  })

  describe(
    InteropRecentPricesRepository.prototype.getClosestPricesForQueries.name,
    () => {
      it('returns closest prices for multiple query tuples', async () => {
        await repository.insertMany([
          mock('bitcoin', UnixTime(900), 30_000),
          mock('bitcoin', UnixTime(1_100), 31_000),
          mock('ethereum', UnixTime(800), 2_000),
          mock('ethereum', UnixTime(1_300), 2_500),
        ])

        const queries: InteropClosestPriceQuery<'btc' | 'eth'>[] = [
          { key: 'btc', coingeckoId: 'bitcoin', timestamp: UnixTime(1_000) },
          { key: 'eth', coingeckoId: 'ethereum', timestamp: UnixTime(1_000) },
        ]

        const result = await repository.getClosestPricesForQueries(
          queries,
          UnixTime.DAY,
        )

        expect(result.get('btc')).toEqual(31_000)
        expect(result.get('eth')).toEqual(2_000)
      })

      it('uses query-specific timestamp for the same coingecko id', async () => {
        await repository.insertMany([
          mock('bitcoin', UnixTime(900), 30_000),
          mock('bitcoin', UnixTime(1_100), 31_000),
        ])

        const queries: InteropClosestPriceQuery<'earlier' | 'later'>[] = [
          {
            key: 'earlier',
            coingeckoId: 'bitcoin',
            timestamp: UnixTime(950),
          },
          {
            key: 'later',
            coingeckoId: 'bitcoin',
            timestamp: UnixTime(1_050),
          },
        ]

        const result = await repository.getClosestPricesForQueries(
          queries,
          UnixTime.DAY,
        )

        expect(result.get('earlier')).toEqual(30_000)
        expect(result.get('later')).toEqual(31_000)
      })

      it('returns undefined when no price is within error margin', async () => {
        await repository.insertMany([
          mock('bitcoin', UnixTime(1_000 + UnixTime.DAY + 1), 30_000),
        ])

        const queries: InteropClosestPriceQuery<'btc'>[] = [
          { key: 'btc', coingeckoId: 'bitcoin', timestamp: UnixTime(1_000) },
        ]

        const result = await repository.getClosestPricesForQueries(
          queries,
          UnixTime.DAY,
        )

        expect(result.get('btc')).toEqual(undefined)
      })

      it('returns empty map for empty queries', async () => {
        const result = await repository.getClosestPricesForQueries(
          [],
          UnixTime.DAY,
        )

        expect(result.size).toEqual(0)
      })
    },
  )

  describe(InteropRecentPricesRepository.prototype.deleteBefore.name, () => {
    it('deletes records before timestamp and returns count', async () => {
      const records = [
        mock('bitcoin', UnixTime(100)),
        mock('bitcoin', UnixTime(200)),
        mock('bitcoin', UnixTime(300)),
        mock('ethereum', UnixTime(150)),
      ]

      await repository.insertMany(records)

      const deletedCount = await repository.deleteBefore(UnixTime(250))
      expect(deletedCount).toEqual(3)

      const remaining = await repository.getAll()
      expect(remaining).toEqualUnsorted([saved('bitcoin', UnixTime(300), 1000)])
    })

    it('returns 0 when no records before timestamp', async () => {
      await repository.insertMany([
        mock('bitcoin', UnixTime(200)),
        mock('bitcoin', UnixTime(300)),
      ])

      const deletedCount = await repository.deleteBefore(UnixTime(100))
      expect(deletedCount).toEqual(0)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(2)
    })

    it('returns 0 when no records exist', async () => {
      const deletedCount = await repository.deleteBefore(UnixTime(100))
      expect(deletedCount).toEqual(0)
    })
  })

  describe(InteropRecentPricesRepository.prototype.deleteAfter.name, () => {
    it('deletes records after timestamp and returns count', async () => {
      const records = [
        mock('bitcoin', UnixTime(100)),
        mock('bitcoin', UnixTime(200)),
        mock('bitcoin', UnixTime(300)),
        mock('ethereum', UnixTime(250)),
      ]

      await repository.insertMany(records)

      const deletedCount = await repository.deleteAfter(UnixTime(150))
      expect(deletedCount).toEqual(3)

      const remaining = await repository.getAll()
      expect(remaining).toEqualUnsorted([saved('bitcoin', UnixTime(100), 1000)])
    })

    it('returns 0 when no records after timestamp', async () => {
      await repository.insertMany([
        mock('bitcoin', UnixTime(100)),
        mock('bitcoin', UnixTime(200)),
      ])

      const deletedCount = await repository.deleteAfter(UnixTime(300))
      expect(deletedCount).toEqual(0)

      const remaining = await repository.getAll()
      expect(remaining).toHaveLength(2)
    })

    it('returns 0 when no records exist', async () => {
      const deletedCount = await repository.deleteAfter(UnixTime(100))
      expect(deletedCount).toEqual(0)
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function mock(
  coingeckoId: string,
  timestamp: UnixTime,
  priceUsd = 1000,
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
