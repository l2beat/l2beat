import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import {
  RpcTransactionCountRecord,
  RpcTransactionCountRepository,
} from '../../../src/peripherals/database/RpcTransactionCountRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(RpcTransactionCountRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new RpcTransactionCountRepository(database, Logger.SILENT)

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    RpcTransactionCountRepository.prototype.getMissingRangesByProject.name,
    () => {
      it('works with an empty repository', async () => {
        expect(await repository.getMissingRangesByProject(PROJECT_A)).toEqual([
          [-Infinity, Infinity],
        ])
      })

      it('finds holes', async () => {
        await repository.addMany([
          fakeTxCount({ blockNumber: 0, projectId: PROJECT_A }),
          fakeTxCount({ blockNumber: 1, projectId: PROJECT_A }),
          fakeTxCount({ blockNumber: 6, projectId: PROJECT_A }),
          fakeTxCount({ blockNumber: 7, projectId: PROJECT_A }),
          fakeTxCount({ blockNumber: 10, projectId: PROJECT_A }),
        ])

        expect(await repository.getMissingRangesByProject(PROJECT_A)).toEqual([
          [-Infinity, 0],
          [2, 6],
          [8, 10],
          [11, Infinity],
        ])
      })

      it('finds holes when block 0 is missing', async () => {
        await repository.addMany([
          fakeTxCount({ blockNumber: 1, projectId: PROJECT_A }),
        ])

        expect(await repository.getMissingRangesByProject(PROJECT_A)).toEqual([
          [-Infinity, 1],
          [2, Infinity],
        ])
      })

      it('finds holes with multiple projects', async () => {
        await repository.addMany([
          fakeTxCount({ blockNumber: 0, projectId: PROJECT_A }),
          fakeTxCount({ blockNumber: 1, projectId: PROJECT_A }),
          fakeTxCount({ blockNumber: 3, projectId: PROJECT_A }),
          fakeTxCount({ blockNumber: 0, projectId: PROJECT_B }),
          fakeTxCount({ blockNumber: 4, projectId: PROJECT_B }),
        ])

        expect(await repository.getMissingRangesByProject(PROJECT_A)).toEqual([
          [-Infinity, 0],
          [2, 3],
          [4, Infinity],
        ])
        expect(await repository.getMissingRangesByProject(PROJECT_B)).toEqual([
          [-Infinity, 0],
          [1, 4],
          [5, Infinity],
        ])
      })

      it('finds holes on a big set', async () => {
        const numbers = Array.from({ length: 200 }, () =>
          Math.floor(Math.random() * 1000),
        ).filter((x, i, a) => a.indexOf(x) === i)

        await repository.addMany(
          numbers.map((number) =>
            fakeTxCount({ blockNumber: number, projectId: PROJECT_A }),
          ),
        )

        const ranges = await repository.getMissingRangesByProject(PROJECT_A)

        const result = []
        for (const [start, end] of ranges) {
          for (let i = Math.max(start, 0); i < Math.min(end, 1000); i++) {
            result.push(i)
          }
        }

        const expected = []
        for (let i = 0; i < 1000; i++) {
          if (!numbers.includes(i)) {
            expected.push(i)
          }
        }

        expect(result.sort()).toEqual(expected.sort())
      })
    },
  )
})

export function fakeTxCount(
  txCount?: Partial<RpcTransactionCountRecord>,
): RpcTransactionCountRecord {
  return {
    projectId: ProjectId('fake-project'),
    timestamp: new UnixTime(0),
    blockNumber: 0,
    count: Math.floor(Math.random() * 10),
    ...txCount,
  }
}
