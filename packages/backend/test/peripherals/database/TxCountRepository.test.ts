import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import {
  TxCountRecord,
  TxCountRepository,
} from '../../../src/peripherals/database/TxCountRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(TxCountRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new TxCountRepository(database, Logger.SILENT)

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(TxCountRepository.prototype.getMissingByProject.name, () => {
    it('finds holes', async () => {
      await repository.addMany([
        fakeTxCount({ blockNumber: 0, projectId: PROJECT_A }),
        fakeTxCount({ blockNumber: 1, projectId: PROJECT_A }),
        fakeTxCount({ blockNumber: 3, projectId: PROJECT_A }),
      ])

      expect(await repository.getMissingByProject(PROJECT_A)).toEqual([2])
    })
    it('finds holes with multiple projects', async () => {
      await repository.addMany([
        fakeTxCount({ blockNumber: 0, projectId: PROJECT_A }),
        fakeTxCount({ blockNumber: 1, projectId: PROJECT_A }),
        fakeTxCount({ blockNumber: 3, projectId: PROJECT_A }),
        fakeTxCount({ blockNumber: 0, projectId: PROJECT_B }),
        fakeTxCount({ blockNumber: 1, projectId: PROJECT_B }),
        fakeTxCount({ blockNumber: 2, projectId: PROJECT_B }),
        fakeTxCount({ blockNumber: 4, projectId: PROJECT_B }),
      ])

      expect(await repository.getMissingByProject(PROJECT_A)).toEqual([2])
      expect(await repository.getMissingByProject(PROJECT_B)).toEqual([3])
    })
  })
})

function fakeTxCount(txCount?: Partial<TxCountRecord>): TxCountRecord {
  return {
    projectId: ProjectId('fake-project'),
    timestamp: new UnixTime(0),
    blockNumber: 0,
    count: Math.floor(Math.random() * 10),
    ...txCount,
  }
}
