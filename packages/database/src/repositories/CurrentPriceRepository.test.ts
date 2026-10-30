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

  describe(CurrentPriceRepository.prototype.deleteAllExcept.name, () => {
    it('deletes every record whose id is not kept and returns count', async () => {
      await repository.upsertMany([mock('A', 1), mock('B', 2), mock('C', 3)])

      const deletedCount = await repository.deleteAllExcept(['A', 'X'])
      expect(deletedCount).toEqual(2)

      const remaining = await repository.getAll()
      expect(remaining).toEqualUnsorted([saved('A', 1)])
    })

    it('deletes everything for an empty array', async () => {
      await repository.upsertMany([mock('A', 1), mock('B', 2)])

      const deletedCount = await repository.deleteAllExcept([])
      expect(deletedCount).toEqual(2)

      expect(await repository.getAll()).toEqual([])
    })
  })
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
