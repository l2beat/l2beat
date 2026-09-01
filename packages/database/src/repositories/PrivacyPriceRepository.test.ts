import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import { PrivacyPriceRepository } from './PrivacyPriceRepository'

describeDatabase(PrivacyPriceRepository.name, (db) => {
  const repository = db.privacyPrice

  beforeEach(async () => {
    await repository.deleteAll()
  })

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(PrivacyPriceRepository.prototype.upsertMany.name, () => {
    it('inserts and updates records', async () => {
      const records = [
        {
          configurationId: 'cfg1'.padEnd(12),
          timestamp: UnixTime(1000),
          priceUsd: 1.5,
          priceId: 'ethereum',
        },
        {
          configurationId: 'cfg1'.padEnd(12),
          timestamp: UnixTime(2000),
          priceUsd: 2.5,
          priceId: 'ethereum',
        },
        {
          configurationId: 'cfg2'.padEnd(12),
          timestamp: UnixTime(1000),
          priceUsd: 0.5,
          priceId: 'usd-coin',
        },
      ]

      await repository.upsertMany(records)

      const result = await repository.getAll()
      expect(result).toEqualUnsorted(records)
    })
  })

  describe(PrivacyPriceRepository.prototype.getPricesInRange.name, () => {
    it('returns prices in range', async () => {
      const records = [
        {
          configurationId: 'cfg1',
          timestamp: UnixTime(1000),
          priceUsd: 1.5,
          priceId: 'ethereum',
        },
        {
          configurationId: 'cfg1',
          timestamp: UnixTime(2000),
          priceUsd: 2.5,
          priceId: 'ethereum',
        },
        {
          configurationId: 'cfg1',
          timestamp: UnixTime(3000),
          priceUsd: 3.5,
          priceId: 'ethereum',
        },
      ]

      await repository.upsertMany(records)

      const result = await repository.getPricesInRange(
        'cfg1',
        UnixTime(1000),
        UnixTime(2000),
      )

      expect(result).toHaveLength(2)
      expect(result[0]!.priceUsd).toEqual(1.5)
      expect(result[1]!.priceUsd).toEqual(2.5)
    })
  })

  describe(
    PrivacyPriceRepository.prototype.getPricesByPriceIdInRange.name,
    () => {
      it('returns prices by priceId in range', async () => {
        const records = [
          {
            configurationId: 'cfg1',
            timestamp: UnixTime(1000),
            priceUsd: 1.5,
            priceId: 'ethereum',
          },
          {
            configurationId: 'cfg2',
            timestamp: UnixTime(1000),
            priceUsd: 0.5,
            priceId: 'usd-coin',
          },
          {
            configurationId: 'cfg1',
            timestamp: UnixTime(2000),
            priceUsd: 2.5,
            priceId: 'ethereum',
          },
        ]

        await repository.upsertMany(records)

        const result = await repository.getPricesByPriceIdInRange(
          'ethereum',
          UnixTime(1000),
          UnixTime(2000),
        )

        expect(result).toHaveLength(2)
        expect(result[0]!.priceUsd).toEqual(1.5)
        expect(result[1]!.priceUsd).toEqual(2.5)
      })
    },
  )

  describe(
    PrivacyPriceRepository.prototype.getPricesByPriceIdsInRange.name,
    () => {
      it('returns prices for all matching priceIds in range', async () => {
        const records = [
          {
            configurationId: 'cfg1'.padEnd(12),
            timestamp: UnixTime(1000),
            priceUsd: 1.5,
            priceId: 'ethereum',
          },
          {
            configurationId: 'cfg1'.padEnd(12),
            timestamp: UnixTime(2000),
            priceUsd: 2.5,
            priceId: 'ethereum',
          },
          {
            configurationId: 'cfg2'.padEnd(12),
            timestamp: UnixTime(1000),
            priceUsd: 0.5,
            priceId: 'usd-coin',
          },
          {
            configurationId: 'cfg3'.padEnd(12),
            timestamp: UnixTime(1000),
            priceUsd: 100,
            priceId: 'bitcoin',
          },
          {
            configurationId: 'cfg1'.padEnd(12),
            timestamp: UnixTime(3000),
            priceUsd: 3.5,
            priceId: 'ethereum',
          },
        ]

        await repository.upsertMany(records)

        const result = await repository.getPricesByPriceIdsInRange(
          ['ethereum', 'usd-coin'],
          UnixTime(1000),
          UnixTime(2000),
        )

        expect(result).toEqualUnsorted([records[0]!, records[1]!, records[2]!])
      })

      it('returns empty array when priceIds is empty', async () => {
        await repository.upsertMany([
          {
            configurationId: 'cfg1'.padEnd(12),
            timestamp: UnixTime(1000),
            priceUsd: 1.5,
            priceId: 'ethereum',
          },
        ])

        const result = await repository.getPricesByPriceIdsInRange(
          [],
          UnixTime(1000),
          UnixTime(2000),
        )

        expect(result).toEqual([])
      })
    },
  )

  describe(
    PrivacyPriceRepository.prototype.getLatestPriceByPriceId.name,
    () => {
      it('returns latest price for given priceId', async () => {
        await repository.upsertMany([
          {
            configurationId: 'cfg1'.padEnd(12),
            timestamp: UnixTime(1000),
            priceUsd: 1.5,
            priceId: 'ethereum',
          },
          {
            configurationId: 'cfg1'.padEnd(12),
            timestamp: UnixTime(3000),
            priceUsd: 3.5,
            priceId: 'ethereum',
          },
          {
            configurationId: 'cfg1'.padEnd(12),
            timestamp: UnixTime(2000),
            priceUsd: 2.5,
            priceId: 'ethereum',
          },
          {
            configurationId: 'cfg2'.padEnd(12),
            timestamp: UnixTime(9000),
            priceUsd: 0.5,
            priceId: 'usd-coin',
          },
        ])

        const result = await repository.getLatestPriceByPriceId('ethereum')

        expect(result).toEqual({
          configurationId: 'cfg1'.padEnd(12),
          timestamp: UnixTime(3000),
          priceUsd: 3.5,
          priceId: 'ethereum',
        })
      })

      it('returns undefined when no price for priceId', async () => {
        await repository.upsertMany([
          {
            configurationId: 'cfg1'.padEnd(12),
            timestamp: UnixTime(1000),
            priceUsd: 1.5,
            priceId: 'ethereum',
          },
        ])

        const result = await repository.getLatestPriceByPriceId('bitcoin')

        expect(result).toEqual(undefined)
      })
    },
  )

  describe(PrivacyPriceRepository.prototype.deleteByConfigs.name, () => {
    it('deletes records by config and range', async () => {
      const records = [
        {
          configurationId: 'cfg1'.padEnd(12),
          timestamp: UnixTime(1000),
          priceUsd: 1.5,
          priceId: 'ethereum',
        },
        {
          configurationId: 'cfg1'.padEnd(12),
          timestamp: UnixTime(2000),
          priceUsd: 2.5,
          priceId: 'ethereum',
        },
        {
          configurationId: 'cfg2'.padEnd(12),
          timestamp: UnixTime(1000),
          priceUsd: 0.5,
          priceId: 'usd-coin',
        },
      ]

      await repository.upsertMany(records)

      const deleted = await repository.deleteByConfigs([
        {
          configurationId: 'cfg1'.padEnd(12),
          fromInclusive: UnixTime(1000),
          toInclusive: UnixTime(2000),
        },
      ])

      expect(deleted).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqualUnsorted([
        {
          configurationId: 'cfg2'.padEnd(12),
          timestamp: UnixTime(1000),
          priceUsd: 0.5,
          priceId: 'usd-coin',
        },
      ])
    })
  })
})
