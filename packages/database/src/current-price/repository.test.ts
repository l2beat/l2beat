import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import type { CurrentPriceRecord, UpsertableCurrentPrice } from './entity'
import { CurrentPriceRepository } from './repository'

describeDatabase(CurrentPriceRepository.name, (database) => {
  const repository = database.currentPrice

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(`${CurrentPriceRepository.prototype.upsert.name} and ${CurrentPriceRepository.prototype.findOneByAssetId.name}`, async () => {
    it('inserts if not exists', async () => {
      await repository.upsert(mock('A', 1))

      const currentPrice = await repository.findOneByAssetId('A')
      expect(currentPrice).toEqual(saved('A', 1))
    })

    it('updates if exists', async () => {
      await repository.upsert(mock('A', 1))
      await repository.upsert(mock('A', 2))

      const currentPrice = await repository.findOneByAssetId('A')
      expect(currentPrice).toEqual(saved('A', 2))
    })
  })

  describe(`${CurrentPriceRepository.prototype.upsertMany.name} and ${CurrentPriceRepository.prototype.findMany.name}`, async () => {
    it('inserts if not exists', async () => {
      await repository.upsertMany([mock('A', 1), mock('B', 2)])

      const currentPrices = await repository.findMany()
      expect(currentPrices).toEqualUnsorted([saved('A', 1), saved('B', 2)])
    })

    it('updates if exists', async () => {
      await repository.upsertMany([mock('A', 1), mock('B', 2)])
      await repository.upsertMany([mock('A', 2), mock('B', 3)])
      const currentPrices = await repository.findMany()
      expect(currentPrices).toEqualUnsorted([saved('A', 2), saved('B', 3)])
    })
  })

  describe(CurrentPriceRepository.prototype.findByIds.name, async () => {
    it('deletes all currentPrices', async () => {
      await repository.upsertMany([mock('A', 1), mock('B', 2), mock('C', 3)])

      const currentPrices = await repository.findByIds(['A', 'B'])
      expect(currentPrices).toEqualUnsorted([saved('A', 1), saved('B', 2)])
    })
  })
})

function mock(coingeckoId: string, priceUsd: number): UpsertableCurrentPrice {
  return { coingeckoId, priceUsd }
}

function saved(coingeckoId: string, priceUsd: number): CurrentPriceRecord {
  return { coingeckoId, priceUsd, updatedAt: expect.a(Date) }
}
