import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { StakeRecord } from './entity'
import { StakeRepository } from './repository'

describeDatabase(StakeRepository.name, (database) => {
  const repository = database.stake

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(`${StakeRepository.prototype.upsert.name} and ${StakeRepository.prototype.findOneById.name}`, async () => {
    it('inserts if not exists', async () => {
      await repository.upsert(saved('A', 1n, 2n))

      const stake = await repository.findOneById('A')
      expect(stake).toEqual(saved('A', 1n, 2n))
    })

    it('updates if exists', async () => {
      await repository.upsert(saved('A', 1n, 2n))
      await repository.upsert(saved('A', 2n, 3n))

      const stake = await repository.findOneById('A')
      expect(stake).toEqual(saved('A', 2n, 3n))
    })
  })

  describe(StakeRepository.prototype.findMany.name, async () => {
    it('returns all stakes', async () => {
      await repository.upsert(saved('A', 1n, 2n))
      await repository.upsert(saved('B', 2n, 3n))
      await repository.upsert(saved('C', 3n, 4n))
      const stakes = await repository.findMany()
      expect(stakes).toEqualUnsorted([
        saved('A', 1n, 2n),
        saved('B', 2n, 3n),
        saved('C', 3n, 4n),
      ])
    })
  })

  describe(StakeRepository.prototype.findByIds.name, async () => {
    it('deletes all stakes', async () => {
      await repository.upsert(saved('A', 1n, 2n))
      await repository.upsert(saved('B', 2n, 3n))
      await repository.upsert(saved('C', 3n, 4n))

      const stakes = await repository.findByIds(['A', 'B'])
      expect(stakes).toEqualUnsorted([saved('A', 1n, 2n), saved('B', 2n, 3n)])
    })
  })
})

function saved(
  id: string,
  totalStake: bigint,
  thresholdStake: bigint,
): StakeRecord {
  return {
    id,
    totalStake,
    thresholdStake,
  }
}
