import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { TvsPriceRepository } from './TvsPriceRepository'

describeDatabase(TvsPriceRepository.name, (db) => {
  const repository = db.tvsPrice

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(TvsPriceRepository.prototype.insertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        tvsPrice('a', 'eth', UnixTime(100), 1000.5),
        tvsPrice('b', 'btc', UnixTime(200), 20000.75),
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
        records.push(tvsPrice('a', 'eth', UnixTime(i), 1000 + i))
      }

      const inserted = await repository.insertMany(records)
      expect(inserted).toEqual(1500)
    })
  })

  describe(TvsPriceRepository.prototype.getPrice.name, () => {
    it('returns price for a configuration', async () => {
      await repository.insertMany([
        tvsPrice('a', 'eth', UnixTime(100), 1000),
        tvsPrice('a', 'eth', UnixTime(200), 1100),
        tvsPrice('a', 'eth', UnixTime(300), 1200),
        tvsPrice('b', 'btc', UnixTime(100), 20000),
        tvsPrice('b', 'btc', UnixTime(200), 21000),
      ])

      const result = await repository.getPrice('a'.repeat(12), UnixTime(200))

      expect(result).toEqual(tvsPrice('a', 'eth', UnixTime(200), 1100))
    })
  })

  describe(TvsPriceRepository.prototype.getPricesInRange.name, () => {
    it('gets prices for given configIds in time range', async () => {
      await repository.insertMany([
        tvsPrice('a', 'eth', UnixTime(50), 900.5),
        tvsPrice('a', 'eth', UnixTime(100), 1000.5),
        tvsPrice('b', 'btc', UnixTime(100), 20000.75),
        tvsPrice('a', 'eth', UnixTime(200), 1100.25),
        tvsPrice('b', 'btc', UnixTime(200), 21000.5),
        tvsPrice('c', 'usdc', UnixTime(100), 1.0),
        tvsPrice('c', 'usdc', UnixTime(200), 1.0),
        tvsPrice('a', 'eth', UnixTime(300), 1200.0),
      ])

      const configIds = ['a'.repeat(12), 'b'.repeat(12)]

      const result = await repository.getPricesInRange(
        configIds,
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqualUnsorted([
        tvsPrice('a', 'eth', UnixTime(100), 1000.5),
        tvsPrice('b', 'btc', UnixTime(100), 20000.75),
        tvsPrice('a', 'eth', UnixTime(200), 1100.25),
        tvsPrice('b', 'btc', UnixTime(200), 21000.5),
      ])
    })

    it('returns empty array when no data in range', async () => {
      await repository.insertMany([
        tvsPrice('a', 'eth', UnixTime(50), 900.5),
        tvsPrice('a', 'eth', UnixTime(300), 1200.0),
      ])

      const configIds = ['a'.repeat(12)]

      const result = await repository.getPricesInRange(
        configIds,
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqual([])
    })

    it('returns empty array when no matching configIds', async () => {
      await repository.insertMany([tvsPrice('a', 'eth', UnixTime(100), 1000.5)])

      const configIds = ['b'.repeat(12)]

      const result = await repository.getPricesInRange(
        configIds,
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqual([])
    })
  })

  describe(TvsPriceRepository.prototype.getPricesInRangeByPriceId.name, () => {
    beforeEach(async () => {
      await repository.insertMany([
        tvsPrice('a', 'eth', UnixTime(50), 900.5),
        tvsPrice('a', 'eth', UnixTime(100), 1000.5),
        tvsPrice('b', 'btc', UnixTime(100), 20000.75),
        tvsPrice('c', 'eth', UnixTime(150), 1050.25),
        tvsPrice('a', 'eth', UnixTime(200), 1100.25),
        tvsPrice('b', 'btc', UnixTime(200), 21000.5),
        tvsPrice('d', 'usdc', UnixTime(100), 1.0),
        tvsPrice('d', 'usdc', UnixTime(200), 1.0),
        tvsPrice('a', 'eth', UnixTime(300), 1200.0),
      ])
    })

    it('returns only records for the specified priceId', async () => {
      const result = await repository.getPricesInRangeByPriceId(
        'eth',
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqualUnsorted([
        tvsPrice('a', 'eth', UnixTime(100), 1000.5),
        tvsPrice('c', 'eth', UnixTime(150), 1050.25),
        tvsPrice('a', 'eth', UnixTime(200), 1100.25),
      ])
    })

    it('returns empty array when no data', async () => {
      const result = await repository.getPricesInRangeByPriceId(
        'eth',
        UnixTime(225),
        UnixTime(275),
      )

      expect(result).toEqual([])
    })
  })

  describe(TvsPriceRepository.prototype.getLatestPriceBefore.name, () => {
    it('returns the latest price for a configuration', async () => {
      await repository.insertMany([
        tvsPrice('a', 'eth', UnixTime(100), 1000),
        tvsPrice('a', 'eth', UnixTime(200), 1100),
        tvsPrice('a', 'eth', UnixTime(300), 1200),
        tvsPrice('b', 'btc', UnixTime(100), 20000),
        tvsPrice('b', 'btc', UnixTime(200), 21000),
      ])

      const result = await repository.getLatestPriceBefore(
        'a'.repeat(12),
        UnixTime(250),
      )

      expect(result).toEqual(tvsPrice('a', 'eth', UnixTime(200), 1100))
    })

    it('returns undefined when no prices exist for the configuration', async () => {
      await repository.insertMany([tvsPrice('a', 'eth', UnixTime(200), 1000)])

      const result = await repository.getLatestPriceBefore(
        'b'.repeat(12),
        UnixTime(250),
      )

      expect(result).toEqual(undefined)
    })
  })

  describe(TvsPriceRepository.prototype.deleteByConfigInTimeRange.name, () => {
    it('deletes data in range for matching config', async () => {
      await repository.insertMany([
        tvsPrice('b', 'eth', UnixTime(1), 1000),
        tvsPrice('b', 'eth', UnixTime(2), 1100),
        tvsPrice('b', 'eth', UnixTime(3), 1200),
        tvsPrice('c', 'btc', UnixTime(2), 20000),
      ])

      const deleted = await repository.deleteByConfigInTimeRange(
        'b'.repeat(12),
        UnixTime(1),
        UnixTime(2),
      )

      expect(deleted).toEqual(2)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        tvsPrice('b', 'eth', UnixTime(3), 1200),
        tvsPrice('c', 'btc', UnixTime(2), 20000),
      ])
    })

    it('returns 0 if no matching config found', async () => {
      await repository.insertMany([tvsPrice('b', 'eth', UnixTime(1), 1000)])

      const deleted = await repository.deleteByConfigInTimeRange(
        'c'.repeat(12),
        UnixTime(1),
        UnixTime(2),
      )

      expect(deleted).toEqual(0)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([tvsPrice('b', 'eth', UnixTime(1), 1000)])
    })
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function tvsPrice(
  configId: string,
  priceId: string,
  timestamp: UnixTime,
  priceUsd: number,
) {
  return {
    configurationId: configId.repeat(12),
    priceId,
    timestamp,
    priceUsd,
  }
}
