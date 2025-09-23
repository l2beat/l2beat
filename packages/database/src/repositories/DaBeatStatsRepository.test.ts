import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type DaBeatStatsRecord,
  DaBeatStatsRepository,
} from './DaBeatStatsRepository'

describeDatabase(DaBeatStatsRepository.name, (database) => {
  const repository = database.daBeatStats

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(DaBeatStatsRepository.prototype.findById.name, async () => {
    it('finds existing record', async () => {
      await repository.upsert(saved('A', 1n, 2n, 3))
      const records = await repository.findById('A')
      expect(records).toEqual(saved('A', 1n, 2n, 3))
    })

    it('returns undefined for nonexistent records', async () => {
      await repository.upsert(saved('A', 1n, 2n, null))
      const records = await repository.findById('B')
      expect(records).toEqual(undefined)
    })
  })

  describe(DaBeatStatsRepository.prototype.upsertMany.name, async () => {
    it('inserts records', async () => {
      await repository.upsertMany([
        saved('A', 1n, 2n, 3),
        saved('B', 2n, 3n, null),
      ])

      const records = await repository.getAll()
      expect(records).toEqual([saved('A', 1n, 2n, 3), saved('B', 2n, 3n, null)])
    })

    it('updates conflicting records', async () => {
      await repository.upsertMany([
        saved('A', 1n, 2n, 3),
        saved('B', 2n, 3n, null),
      ])
      await repository.upsertMany([
        saved('A', 11n, 22n, 33),
        saved('B', 22n, 33n, null),
      ])

      const records = await repository.getAll()
      expect(records).toEqual([
        saved('A', 11n, 22n, 33),
        saved('B', 22n, 33n, null),
      ])
    })
  })

  describe(DaBeatStatsRepository.prototype.getByIds.name, async () => {
    it('deletes all stakes', async () => {
      await repository.upsert(saved('A', 1n, 2n, 3))
      await repository.upsert(saved('B', 2n, 3n, null))
      await repository.upsert(saved('C', 3n, 4n, null))

      const stakes = await repository.getByIds(['A', 'B'])
      expect(stakes).toEqualUnsorted([
        saved('A', 1n, 2n, 3),
        saved('B', 2n, 3n, null),
      ])
    })
  })
})

function saved(
  id: string,
  totalStake: bigint,
  thresholdStake: bigint,
  numberOfValidators: number | null,
): DaBeatStatsRecord {
  return { id, totalStake, thresholdStake, numberOfValidators }
}
