import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { StarkExTransactionCountRepository } from './repository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

describeDatabase(StarkExTransactionCountRepository.name, (db) => {
  const repository = db.starkExTransactionCount

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(StarkExTransactionCountRepository.prototype.upsertMany.name, () => {
    it('adds multiple records', async () => {
      const records = [
        mockRecord(PROJECT_A, 0, 100),
        mockRecord(PROJECT_B, 0, 200),
      ]

      await repository.upsertMany(records)

      const result = await repository.getAll()

      expect(result).toEqual(records)
    })

    it('updates multiple records', async () => {
      const records = [
        mockRecord(PROJECT_A, 0, 100),
        mockRecord(PROJECT_B, 0, 200),
      ]
      await repository.upsertMany(records)

      const updatedRecords = [
        mockRecord(PROJECT_A, 0, 1000),
        mockRecord(PROJECT_B, 0, 2000),
      ]
      await repository.upsertMany(updatedRecords)

      const result = await repository.getAll()

      expect(result).toEqual(updatedRecords)
    })
  })
})

const mockRecord = (projectId: ProjectId, offset: number, count: number) => ({
  projectId,
  count,
  timestamp: new UnixTime(1000 + offset),
})
