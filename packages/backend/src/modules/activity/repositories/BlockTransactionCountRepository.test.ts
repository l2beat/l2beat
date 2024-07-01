import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { BlockTransactionCountRepository } from './BlockTransactionCountRepository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')

describeDatabase(BlockTransactionCountRepository.name, (knex, kysely) => {
  const oldRepo = new BlockTransactionCountRepository(knex, Logger.SILENT)
  const newRepo = kysely.blockTransactionCount

  suite(oldRepo)
  suite(newRepo)

  function suite(repository: typeof oldRepo | typeof newRepo) {
    beforeEach(async () => {
      await repository.deleteAll()
    })

    it(
      BlockTransactionCountRepository.prototype.addOrUpdateMany.name,
      async () => {
        const records = [mockRecord(PROJECT_A, 0), mockRecord(PROJECT_B, 0)]

        await repository.addOrUpdateMany(records)

        const result = await repository.getAll()

        expect(result).toEqual(records)
      },
    )

    describe(BlockTransactionCountRepository.prototype.addOrUpdate.name, () => {
      it('merges on conflict', async () => {
        await repository.addOrUpdate(mockRecord(PROJECT_A, 0))
        await repository.addOrUpdate({ ...mockRecord(PROJECT_A, 0), count: 2 })

        const result = await repository.getAll()

        expect(result).toEqual([{ ...mockRecord(PROJECT_A, 0), count: 2 }])
      })
    })
  }
})

const mockRecord = (projectId: ProjectId, offset: number) => ({
  projectId,
  blockNumber: 100 + offset,
  count: 1,
  timestamp: new UnixTime(1000 + offset),
})
