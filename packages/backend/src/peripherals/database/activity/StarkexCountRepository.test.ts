import { Logger, ProjectId, UnixTime } from '@l2beat/shared'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../../test/database'
import { StarkexTransactionCountRepository } from './StarkexCountRepository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

describe(StarkexTransactionCountRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new StarkexTransactionCountRepository(
    database,
    Logger.SILENT,
  )

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    StarkexTransactionCountRepository.prototype.findLastTimestampByProjectId
      .name,
    () => {
      it('works with empty database', async () => {
        expect(
          await repository.findLastTimestampByProjectId(ProjectId('starknet')),
        ).toEqual(undefined)
      })
    },
  )

  describe(
    StarkexTransactionCountRepository.prototype.addOrUpdateMany.name,
    () => {
      it('adds multiple records', async () => {
        const records = [
          mockRecord(PROJECT_A, 0, 100),
          mockRecord(PROJECT_B, 0, 200),
        ]

        await repository.addOrUpdateMany(records)

        const latestProjectA = await repository.findLastTimestampByProjectId(
          PROJECT_A,
        )
        const latestProjectB = await repository.findLastTimestampByProjectId(
          PROJECT_B,
        )
        expect(latestProjectA).toEqual(records[0].timestamp)
        expect(latestProjectB).toEqual(records[1].timestamp)
      })

      it('updates multiple records', async () => {
        const records = [
          mockRecord(PROJECT_A, 0, 100),
          mockRecord(PROJECT_B, 0, 200),
        ]
        await repository.addOrUpdateMany(records)

        const updatedRecords = [
          mockRecord(PROJECT_A, 0, 1000),
          mockRecord(PROJECT_B, 0, 2000),
        ]
        await repository.addOrUpdateMany(records)

        const latestProjectA = await repository.findLastTimestampByProjectId(
          PROJECT_A,
        )
        const latestProjectB = await repository.findLastTimestampByProjectId(
          PROJECT_B,
        )
        expect(latestProjectA).toEqual(updatedRecords[0].timestamp)
        expect(latestProjectB).toEqual(updatedRecords[1].timestamp)
      })
    },
  )
})

const mockRecord = (projectId: ProjectId, offset: number, count: number) => ({
  projectId,
  blockNumber: 100 + offset,
  count,
  timestamp: new UnixTime(1000 + offset),
})
