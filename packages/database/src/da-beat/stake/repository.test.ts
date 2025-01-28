import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { StakeRecord } from './entity'
import { StakeRepository } from './repository'

describeDatabase(StakeRepository.name, (database) => {
  const repository = database.stake

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(StakeRepository.prototype.findById.name, async () => {
    it('finds existing record', async () => {
      await repository.upsert(saved('A', 1n, 2n))
      const records = await repository.findById('A')
      expect(records).toEqual(saved('A', 1n, 2n))
    })

    it('returns undefined for nonexistent records', async () => {
      await repository.upsert(saved('A', 1n, 2n))
      const records = await repository.findById('B')
      expect(records).toEqual(undefined)
    })
  })

  describe(StakeRepository.prototype.upsertMany.name, async () => {
    it('inserts records', async () => {
      await repository.upsertMany([saved('A', 1n, 2n), saved('B', 2n, 3n)])

      const records = await repository.getAll()
      expect(records).toEqual([saved('A', 1n, 2n), saved('B', 2n, 3n)])
    })

    it('updates conflicting records', async () => {
      await repository.upsertMany([saved('A', 1n, 2n), saved('B', 2n, 3n)])
      await repository.upsertMany([saved('A', 11n, 22n), saved('B', 22n, 33n)])

      const records = await repository.getAll()
      expect(records).toEqual([saved('A', 11n, 22n), saved('B', 22n, 33n)])
    })
  })

  describe(StakeRepository.prototype.getByIds.name, async () => {
    it('deletes all stakes', async () => {
      await repository.upsert(saved('A', 1n, 2n))
      await repository.upsert(saved('B', 2n, 3n))
      await repository.upsert(saved('C', 3n, 4n))

      const stakes = await repository.getByIds(['A', 'B'])
      expect(stakes).toEqualUnsorted([saved('A', 1n, 2n), saved('B', 2n, 3n)])
    })
  })
})

function saved(
  id: string,
  totalStake: bigint,
  thresholdStake: bigint,
): StakeRecord {
  return { id, totalStake, thresholdStake }
}
