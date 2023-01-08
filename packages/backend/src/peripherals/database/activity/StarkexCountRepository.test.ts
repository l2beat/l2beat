import { Logger } from '@l2beat/common'
import { ProjectId } from '@l2beat/types'
import { expect } from 'earljs'

import { setupDatabaseTestSuite } from '../../../test/database'
import { createMockMetrics } from '../../../test/mocks/Metrics'
import { StarkexTransactionCountRepository } from './StarkexCountRepository'

describe(StarkexTransactionCountRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new StarkexTransactionCountRepository(
    database,
    Logger.SILENT,
    createMockMetrics(),
  )

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    StarkexTransactionCountRepository.prototype.getLastTimestampByProjectId
      .name,
    () => {
      it('works with empty database', async () => {
        expect(
          await repository.getLastTimestampByProjectId(ProjectId.STARKNET),
        ).toEqual(undefined)
      })
    },
  )
})
