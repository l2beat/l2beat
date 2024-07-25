import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { BlockTransactionCountRepository } from './repository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

describeDatabase(BlockTransactionCountRepository.name, (db) => {
  const repository = db.blockTransactionCount

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    BlockTransactionCountRepository.prototype.addOrUpdateMany.name,
    () => {
      it('adds records', async () => {
        const records = [mockRecord(PROJECT_A, 0), mockRecord(PROJECT_B, 0)]
        await repository.addOrUpdateMany(records)

        const result = await repository.getAll()
        expect(result).toEqual(records)
      })

      it('merges on conflict', async () => {
        await repository.addOrUpdateMany([mockRecord(PROJECT_A, 0)])
        await repository.addOrUpdateMany([
          { ...mockRecord(PROJECT_A, 0), count: 2 },
        ])

        const result = await repository.getAll()
        expect(result).toEqual([{ ...mockRecord(PROJECT_A, 0), count: 2 }])
      })
    },
  )
})

const mockRecord = (projectId: ProjectId, offset: number) => ({
  projectId,
  blockNumber: 100 + offset,
  count: 1,
  timestamp: new UnixTime(1000 + offset),
})
