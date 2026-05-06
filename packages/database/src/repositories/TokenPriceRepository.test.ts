import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { testDeletingArchivedRecords } from '../utils/deleteArchivedRecords.test'
import { TokenPriceRepository } from './TokenPriceRepository'

describeDatabase(TokenPriceRepository.name, (db) => {
  const repository = db.tokenPrice

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(TokenPriceRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      const records = [
        tokenPrice('a', 'eth', UnixTime(100), 1000.5),
        tokenPrice('b', 'btc', UnixTime(200), 20000.75),
      ]

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })

    it('handles empty array', async () => {
      const inserted = await repository.upsertMany([])
      expect(inserted).toEqual(0)
    })

    it('performs batch insert when more than 1000 records', async () => {
      const records = []
      for (let i = 0; i < 1500; i++) {
        records.push(tokenPrice('a', 'eth', UnixTime(i), 1000 + i))
      }

      const inserted = await repository.upsertMany(records)
      expect(inserted).toEqual(1500)
    })

    it('updates existing records on conflict', async () => {
      const initialRecords = [
        tokenPrice('a', 'eth', UnixTime(100), 1000.5),
        tokenPrice('b', 'btc', UnixTime(200), 20000.75),
      ]

      await repository.upsertMany(initialRecords)

      const updatedRecords = [
        tokenPrice('a', 'eth', UnixTime(100), 1500.25),
        tokenPrice('b', 'btc', UnixTime(200), 25000.5),
      ]

      const inserted = await repository.upsertMany(updatedRecords)
      expect(inserted).toEqual(2)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(updatedRecords)
    })
  })

  describe(TokenPriceRepository.prototype.getPrice.name, () => {
    it('returns price for a configuration', async () => {
      await repository.upsertMany([
        tokenPrice('a', 'eth', UnixTime(100), 1000),
        tokenPrice('a', 'eth', UnixTime(200), 1100),
        tokenPrice('a', 'eth', UnixTime(300), 1200),
        tokenPrice('b', 'btc', UnixTime(100), 20000),
        tokenPrice('b', 'btc', UnixTime(200), 21000),
      ])

      const result = await repository.getPrice('a'.repeat(12), UnixTime(200))

      expect(result).toEqual(tokenPrice('a', 'eth', UnixTime(200), 1100))
    })
  })

  describe(TokenPriceRepository.prototype.getPricesInRange.name, () => {
    it('gets prices for given configIds in time range', async () => {
      await repository.upsertMany([
        tokenPrice('a', 'eth', UnixTime(50), 900.5),
        tokenPrice('a', 'eth', UnixTime(100), 1000.5),
        tokenPrice('b', 'btc', UnixTime(100), 20000.75),
        tokenPrice('a', 'eth', UnixTime(200), 1100.25),
        tokenPrice('b', 'btc', UnixTime(200), 21000.5),
        tokenPrice('c', 'usdc', UnixTime(100), 1.0),
        tokenPrice('c', 'usdc', UnixTime(200), 1.0),
        tokenPrice('a', 'eth', UnixTime(300), 1200.0),
      ])

      const configIds = ['a'.repeat(12), 'b'.repeat(12)]

      const result = await repository.getPricesInRange(
        configIds,
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqualUnsorted([
        tokenPrice('a', 'eth', UnixTime(100), 1000.5),
        tokenPrice('b', 'btc', UnixTime(100), 20000.75),
        tokenPrice('a', 'eth', UnixTime(200), 1100.25),
        tokenPrice('b', 'btc', UnixTime(200), 21000.5),
      ])
    })

    it('returns empty array when no data in range', async () => {
      await repository.upsertMany([
        tokenPrice('a', 'eth', UnixTime(50), 900.5),
        tokenPrice('a', 'eth', UnixTime(300), 1200.0),
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
      await repository.upsertMany([tokenPrice('a', 'eth', UnixTime(100), 1000.5)])

      const configIds = ['b'.repeat(12)]

      const result = await repository.getPricesInRange(
        configIds,
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqual([])
    })

    it('returns empty array when configurationIds is empty', async () => {
      await repository.upsertMany([tokenPrice('a', 'eth', UnixTime(100), 1000.5)])

      const result = await repository.getPricesInRange(
        [],
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqual([])
    })
  })

  describe(TokenPriceRepository.prototype.getPricesInRangeByPriceId.name, () => {
    beforeEach(async () => {
      await repository.upsertMany([
        tokenPrice('a', 'eth', UnixTime(50), 900.5),
        tokenPrice('a', 'eth', UnixTime(100), 1000.5),
        tokenPrice('b', 'btc', UnixTime(100), 20000.75),
        tokenPrice('c', 'eth', UnixTime(150), 1050.25),
        tokenPrice('a', 'eth', UnixTime(200), 1100.25),
        tokenPrice('b', 'btc', UnixTime(200), 21000.5),
        tokenPrice('d', 'usdc', UnixTime(100), 1.0),
        tokenPrice('d', 'usdc', UnixTime(200), 1.0),
        tokenPrice('a', 'eth', UnixTime(300), 1200.0),
      ])
    })

    it('returns only records for the specified priceId', async () => {
      const result = await repository.getPricesInRangeByPriceId(
        'eth',
        UnixTime(100),
        UnixTime(200),
      )

      expect(result).toEqualUnsorted([
        tokenPrice('a', 'eth', UnixTime(100), 1000.5),
        tokenPrice('c', 'eth', UnixTime(150), 1050.25),
        tokenPrice('a', 'eth', UnixTime(200), 1100.25),
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

  describe(TokenPriceRepository.prototype.getLatestPriceBefore.name, () => {
    it('returns the latest price for a configuration', async () => {
      await repository.upsertMany([
        tokenPrice('a', 'eth', UnixTime(100), 1000),
        tokenPrice('a', 'eth', UnixTime(200), 1100),
        tokenPrice('a', 'eth', UnixTime(300), 1200),
        tokenPrice('b', 'btc', UnixTime(100), 20000),
        tokenPrice('b', 'btc', UnixTime(200), 21000),
      ])

      const result = await repository.getLatestPriceBefore(
        'a'.repeat(12),
        UnixTime(250),
      )

      expect(result).toEqual(tokenPrice('a', 'eth', UnixTime(200), 1100))
    })

    it('returns undefined when no prices exist for the configuration', async () => {
      await repository.upsertMany([tokenPrice('a', 'eth', UnixTime(200), 1000)])

      const result = await repository.getLatestPriceBefore(
        'b'.repeat(12),
        UnixTime(250),
      )

      expect(result).toEqual(undefined)
    })
  })

  describe(TokenPriceRepository.prototype.deleteByConfigs.name, () => {
    it('deletes data in range for matching configs', async () => {
      await repository.upsertMany([
        tokenPrice('b', 'eth', UnixTime(1), 1000),
        tokenPrice('b', 'eth', UnixTime(2), 1100),
        tokenPrice('b', 'eth', UnixTime(3), 1200),
        tokenPrice('c', 'btc', UnixTime(2), 20000),
      ])

      const deleted = await repository.deleteByConfigs([
        {
          configurationId: 'b'.repeat(12),
          fromInclusive: UnixTime(1),
          toInclusive: UnixTime(2),
        },
      ])

      expect(deleted).toEqual(2)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        tokenPrice('b', 'eth', UnixTime(3), 1200),
        tokenPrice('c', 'btc', UnixTime(2), 20000),
      ])
    })

    it('returns 0 if no matching config found', async () => {
      await repository.upsertMany([tokenPrice('b', 'eth', UnixTime(1), 1000)])

      const deleted = await repository.deleteByConfigs([
        {
          configurationId: 'c'.repeat(12),
          fromInclusive: UnixTime(1),
          toInclusive: UnixTime(2),
        },
      ])

      expect(deleted).toEqual(0)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([tokenPrice('b', 'eth', UnixTime(1), 1000)])
    })

    it('returns 0 for empty configs', async () => {
      const deleted = await repository.deleteByConfigs([])
      expect(deleted).toEqual(0)
    })
  })

  describe('archived cleaning methods', () => {
    testDeletingArchivedRecords(
      {
        deleteHourlyUntil: (dateRange) =>
          repository.deleteHourlyUntil(dateRange),
        deleteSixHourlyUntil: (dateRange) =>
          repository.deleteSixHourlyUntil(dateRange),
        insertMany: (records) => repository.upsertMany(records),
        getAll: () => repository.getAll(),
      },
      (timestamp) => tokenPrice('a', 'eth', timestamp, 1),
    )
  })

  afterEach(async () => {
    await repository.deleteAll()
  })
})

function tokenPrice(
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
