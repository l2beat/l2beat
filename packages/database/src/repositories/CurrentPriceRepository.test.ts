import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type CurrentPriceRecord,
  CurrentPriceRepository,
} from './CurrentPriceRepository'

describeDatabase(CurrentPriceRepository.name, (database) => {
  const repository = database.currentPrice

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(CurrentPriceRepository.prototype.upsertMany.name, async () => {
    it('inserts if not exists', async () => {
      await repository.upsertMany([mock('A', 1), mock('B', 2)])

      const currentPrices = await repository.getAll()
      expect(currentPrices).toEqualUnsorted([saved('A', 1), saved('B', 2)])
    })

    it('updates if exists', async () => {
      await repository.upsertMany([mock('A', 1), mock('B', 2)])
      await repository.upsertMany([mock('A', 2), mock('B', 3)])
      const currentPrices = await repository.getAll()
      expect(currentPrices).toEqualUnsorted([saved('A', 2), saved('B', 3)])
    })
  })

  describe(
    CurrentPriceRepository.prototype.getByCoingeckoIds.name,
    async () => {
      it('deletes all currentPrices', async () => {
        await repository.upsertMany([mock('A', 1), mock('B', 2), mock('C', 3)])

        const currentPrices = await repository.getByCoingeckoIds(['A', 'B'])
        expect(currentPrices).toEqualUnsorted([saved('A', 1), saved('B', 2)])
      })
    },
  )

  describe(
    CurrentPriceRepository.prototype.deleteByCoingeckoIds.name,
    async () => {
      it('returns 0 for empty array', async () => {
        await repository.upsertMany([mock('A', 1), mock('B', 2)])

        const deletedCount = await repository.deleteByCoingeckoIds([])
        expect(deletedCount).toEqual(0)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([saved('A', 1), saved('B', 2)])
      })

      it('deletes existing records and returns count', async () => {
        await repository.upsertMany([mock('A', 1), mock('B', 2), mock('C', 3)])

        const deletedCount = await repository.deleteByCoingeckoIds(['A', 'B'])
        expect(deletedCount).toEqual(2)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([saved('C', 3)])
      })

      it('returns 0 when deleting non-existent records', async () => {
        await repository.upsertMany([mock('A', 1), mock('B', 2)])

        const deletedCount = await repository.deleteByCoingeckoIds(['X', 'Y'])
        expect(deletedCount).toEqual(0)

        const remaining = await repository.getAll()
        expect(remaining).toEqualUnsorted([saved('A', 1), saved('B', 2)])
      })
    },
  )
})

function mock(
  coingeckoId: string,
  priceUsd: number,
): Omit<CurrentPriceRecord, 'updatedAt'> {
  return { coingeckoId, priceUsd }
}

function saved(coingeckoId: string, priceUsd: number): CurrentPriceRecord {
  return { coingeckoId, priceUsd, updatedAt: expect.a(Date) }
}
