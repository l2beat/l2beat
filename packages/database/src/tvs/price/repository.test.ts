import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { TvsPriceRepository } from './repository'

describeDatabase(TvsPriceRepository.name, (db) => {
  const repository = db.tvsPrice

  describe(TvsPriceRepository.prototype.getPrices.name, () => {
    it('gets prices for given configIds and timestamps', async () => {
      await repository.insertMany([
        tvsPrice('a', 'eth', UnixTime(100), 1000.5),
        tvsPrice('b', 'btc', UnixTime(100), 20000.75),
        tvsPrice('a', 'eth', UnixTime(200), 1100.25),
        tvsPrice('b', 'btc', UnixTime(200), 21000.5),
        tvsPrice('c', 'usdc', UnixTime(100), 1.0),
        tvsPrice('c', 'usdc', UnixTime(200), 1.0),
      ])

      const configIds = ['a'.repeat(12), 'b'.repeat(12)]
      const timestamps = [UnixTime(100), UnixTime(200)]

      const result = await repository.getPrices(configIds, timestamps)

      expect(result.size).toEqual(2)
      expect(result.get(UnixTime(100))?.get('a'.repeat(12))).toEqual(1000.5)
      expect(result.get(UnixTime(100))?.get('b'.repeat(12))).toEqual(20000.75)
      expect(result.get(UnixTime(200))?.get('a'.repeat(12))).toEqual(1100.25)
      expect(result.get(UnixTime(200))?.get('b'.repeat(12))).toEqual(21000.5)
    })

    it('returns empty maps for timestamps with no data', async () => {
      await repository.insertMany([tvsPrice('a', 'eth', UnixTime(100), 1000.5)])

      const configIds = ['a'.repeat(12)]
      const timestamps = [UnixTime(100), UnixTime(200)]

      const result = await repository.getPrices(configIds, timestamps)

      expect(result.size).toEqual(2)
      expect(result.get(UnixTime(100))?.get('a'.repeat(12))).toEqual(1000.5)
      expect(result.get(UnixTime(200))?.size).toEqual(0)
    })

    it('throws error when timestamps array is empty', async () => {
      await expect(repository.getPrices(['a'.repeat(12)], [])).toBeRejectedWith(
        'Timestamps should not be empty',
      )
    })
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
