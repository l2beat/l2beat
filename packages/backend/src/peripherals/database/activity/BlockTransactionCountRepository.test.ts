import { Logger } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { setupDatabaseTestSuite } from '../../../test/database'
import { BlockTransactionCountRepository } from './BlockTransactionCountRepository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

describe(BlockTransactionCountRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new BlockTransactionCountRepository(
    database,
    Logger.SILENT,
  )

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(BlockTransactionCountRepository.prototype.addMany.name, async () => {
    const records = [mockRecord(PROJECT_A, 0), mockRecord(PROJECT_B, 0)]

    await repository.addMany(records)

    const result = await repository.getAll()

    expect(result).toEqual(records)
  })
})

const mockRecord = (projectId: ProjectId, offset: number) => ({
  projectId,
  blockNumber: 100 + offset,
  count: 1,
  timestamp: new UnixTime(1000 + offset),
})
