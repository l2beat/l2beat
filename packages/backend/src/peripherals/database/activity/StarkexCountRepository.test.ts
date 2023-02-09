import { Logger, ProjectId } from '@l2beat/shared'
import { expect } from 'earljs'

import { setupDatabaseTestSuite } from '../../../test/database'
import { StarkexTransactionCountRepository } from './StarkexCountRepository'

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
          await repository.findLastTimestampByProjectId(ProjectId.STARKNET),
        ).toEqual(undefined)
      })
    },
  )
})
