import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
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
    InteropRecentPricesRepository.prototype.getClosestPricesAtOrBefore.name,
    () => {
      it('returns the latest price at or before each request timestamp', async () => {
        await repository.insertMany([
          mock('bitcoin', UnixTime(900), 30000),
          mock('bitcoin', UnixTime(1100), 31000),
          mock('bitcoin', UnixTime(1200), 32000),
          mock('ethereum', UnixTime(1000), 3000),
        ])

        const result = await repository.getClosestPricesAtOrBefore(
          [
            {
              requestId: 11,
              coingeckoId: 'bitcoin',
              timestamp: UnixTime(1000),
            },
            {
              requestId: 12,
              coingeckoId: 'bitcoin',
              timestamp: UnixTime(1150),
            },
            { requestId: 13, coingeckoId: 'bitcoin', timestamp: UnixTime(800) },
            {
              requestId: 14,
              coingeckoId: 'ethereum',
              timestamp: UnixTime(1000),
            },
          ],
          UnixTime.DAY,
        )

        expect(result).toEqual(
          new Map([
            [11, 30000],
            [12, 31000],
            [13, undefined],
            [14, 3000],
          ]),
        )
      })

      it('returns undefined when the only earlier price is too old', async () => {
        const timestamp = UnixTime(2 * UnixTime.DAY)
        await repository.insertMany([mock('bitcoin', UnixTime(0), 30000)])

        const result = await repository.getClosestPricesAtOrBefore(
          [{ requestId: 1, coingeckoId: 'bitcoin', timestamp }],
          UnixTime.DAY,
        )

        expect(result.get(1)).toEqual(undefined)
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
