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

  describe(InteropRecentPricesRepository.prototype.hasAnyPrices.name, () => {
    it('returns true when prices exist', async () => {
      await repository.insertMany([mock('bitcoin', UnixTime(100))])

      const result = await repository.hasAnyPrices()
      expect(result).toEqual(true)
    })

    it('returns false when no prices exist', async () => {
      const result = await repository.hasAnyPrices()
      expect(result).toEqual(false)
    })
  })

  describe(
    InteropRecentPricesRepository.prototype.getClosestPrices.name,
    () => {
      describe('single coingeckoId queries', () => {
        it('returns closest price within 1 day, earlier than target', async () => {
          const targetTime = UnixTime(1000)
          await repository.insertMany([
            mock('bitcoin', UnixTime(900), 30000),
            mock('bitcoin', UnixTime(1200), 31000),
          ])

          const result = await repository.getClosestPrices(
            ['bitcoin'],
            targetTime,
            UnixTime.DAY,
          )
          expect(result.get('bitcoin')).toEqual(30000)
        })

        it('returns closest price within 1 day, later than target', async () => {
          const targetTime = UnixTime(1000)
          await repository.insertMany([
            mock('bitcoin', UnixTime(800), 30000),
            mock('bitcoin', UnixTime(1100), 31000),
          ])

          const result = await repository.getClosestPrices(
            ['bitcoin'],
            targetTime,
            UnixTime.DAY,
          )
          expect(result.get('bitcoin')).toEqual(31000)
        })

        it('returns exact price when timestamp matches exactly', async () => {
          const targetTime = UnixTime(1000)
          await repository.insertMany([
            mock('bitcoin', targetTime, 30000),
            mock('bitcoin', UnixTime(900)),
          ])

          const result = await repository.getClosestPrices(
            ['bitcoin'],
            targetTime,
            UnixTime.DAY,
          )
          expect(result.get('bitcoin')).toEqual(30000)
        })

        it('returns price at boundary of 1 day range, earlier than target', async () => {
          const targetTime = UnixTime.DAY + 7
          const oneDayBefore = targetTime - UnixTime.DAY
          await repository.insertMany([mock('bitcoin', oneDayBefore)])

          const result = await repository.getClosestPrices(
            ['bitcoin'],
            targetTime,
            UnixTime.DAY,
          )
          expect(result.get('bitcoin')).toEqual(1000)
        })

        it('returns price at boundary of 1 day range, later than target', async () => {
          const targetTime = UnixTime.DAY + 7
          const oneDayAfter = targetTime + UnixTime.DAY
          await repository.insertMany([mock('bitcoin', oneDayAfter)])

          const result = await repository.getClosestPrices(
            ['bitcoin'],
            targetTime,
            UnixTime.DAY,
          )
          expect(result.get('bitcoin')).toEqual(1000)
        })

        it('returns undefined when no prices within 1 day', async () => {
          const targetTime = UnixTime(1000)
          await repository.insertMany([
            mock('bitcoin', targetTime + UnixTime.DAY + 1),
            mock('bitcoin', targetTime - UnixTime.DAY - 1),
          ])

          const result = await repository.getClosestPrices(
            ['bitcoin'],
            targetTime,
            UnixTime.DAY,
          )
          expect(result.get('bitcoin')).toEqual(undefined)
        })

        it('returns undefined when coingeckoId does not exist', async () => {
          const targetTime = UnixTime(1000)
          await repository.insertMany([mock('ethereum', targetTime)])

          const result = await repository.getClosestPrices(
            ['bitcoin'],
            targetTime,
            UnixTime.DAY,
          )
          expect(result.get('bitcoin')).toEqual(undefined)
        })
      })

      describe('multiple coingeckoIds queries', () => {
        it('returns closest prices for multiple tokens', async () => {
          const targetTime = UnixTime(1000)
          await repository.insertMany([
            mock('bitcoin', UnixTime(900), 30000),
            mock('bitcoin', UnixTime(1200), 20000),
            mock('ethereum', UnixTime(800), 3000),
            mock('ethereum', UnixTime(1100), 2000),
            mock('polygon', UnixTime(1000), 0.8),
            mock('polygon', UnixTime(1100), 0.9),
          ])

          const result = await repository.getClosestPrices(
            ['bitcoin', 'ethereum', 'polygon'],
            targetTime,
            UnixTime.DAY,
          )

          expect(result.get('bitcoin')).toEqual(30000)
          expect(result.get('ethereum')).toEqual(2000)
          expect(result.get('polygon')).toEqual(0.8)
        })

        it('handles mixed scenarios with some tokens having data and others not', async () => {
          const targetTime = UnixTime(1000)
          await repository.insertMany([
            mock('bitcoin', UnixTime(950), 30000),
            mock('ethereum', targetTime + UnixTime.DAY + 1, 2000),
          ])

          const result = await repository.getClosestPrices(
            ['bitcoin', 'ethereum', 'polygon'],
            targetTime,
            UnixTime.DAY,
          )

          expect(result.get('bitcoin')).toEqual(30000)
          expect(result.get('ethereum')).toEqual(undefined)
          expect(result.get('polygon')).toEqual(undefined)
        })
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
