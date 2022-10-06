import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import {
  BlockTransactionCountRecord,
  BlockTransactionCountRepository,
} from '../../../src/peripherals/database/BlockTransactionCountRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(BlockTransactionCountRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new BlockTransactionCountRepository(
    database,
    Logger.SILENT,
  )

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    BlockTransactionCountRepository.prototype.getMissingRangesByProject.name,
    () => {
      it('works with an empty repository', async () => {
        expect(await repository.getMissingRangesByProject(PROJECT_A)).toEqual([
          [-Infinity, Infinity],
        ])
      })

      it('finds holes', async () => {
        await repository.addMany([
          fakeTransactionCount({ blockNumber: 0, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 1, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 6, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 7, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 10, projectId: PROJECT_A }),
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
          fakeTransactionCount({ blockNumber: 1, projectId: PROJECT_A }),
        ])

        expect(await repository.getMissingRangesByProject(PROJECT_A)).toEqual([
          [-Infinity, 1],
          [2, Infinity],
        ])
      })

      it('finds holes with multiple projects', async () => {
        await repository.addMany([
          fakeTransactionCount({ blockNumber: 0, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 1, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 3, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 0, projectId: PROJECT_B }),
          fakeTransactionCount({ blockNumber: 4, projectId: PROJECT_B }),
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
            fakeTransactionCount({ blockNumber: number, projectId: PROJECT_A }),
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

  describe(
    BlockTransactionCountRepository.prototype.getDailyTransactionCount.name,
    () => {
      it('works with empty repository', async () => {
        expect(await repository.getDailyTransactionCount(PROJECT_A)).toEqual([])
      })

      it('counts only for requested project', async () => {
        const start = UnixTime.now().toStartOf('day')
        const aCounts = [
          fakeTransactionCount({
            blockNumber: 1,
            timestamp: start.add(1, 'hours'),
            projectId: PROJECT_A,
          }),
          fakeTransactionCount({
            blockNumber: 2,
            timestamp: start.add(2, 'hours'),
            projectId: PROJECT_A,
          }),
        ]
        const bCounts = [
          fakeTransactionCount({ blockNumber: 1, projectId: PROJECT_B }),
          fakeTransactionCount({ blockNumber: 2, projectId: PROJECT_B }),
        ]
        await repository.addMany([...aCounts, ...bCounts])

        expect(await repository.getDailyTransactionCount(PROJECT_A)).toEqual([
          {
            timestamp: start,
            count: aCounts.reduce((acc, record) => acc + record.count, 0),
          },
        ])
      })

      it('groups by day', async () => {
        const today = UnixTime.now().toStartOf('day')

        await repository.addMany([
          fakeTransactionCount({
            blockNumber: 1,
            timestamp: today.add(1, 'hours'),
            projectId: PROJECT_A,
            count: 1,
          }),
          fakeTransactionCount({
            blockNumber: 2,
            timestamp: today.add(1, 'days').add(-1, 'seconds'),
            projectId: PROJECT_A,
            count: 2,
          }),
          fakeTransactionCount({
            blockNumber: 3,
            timestamp: today.add(1, 'days').add(1, 'hours'),
            projectId: PROJECT_A,
            count: 3,
          }),
          fakeTransactionCount({
            blockNumber: 4,
            timestamp: today.add(2, 'days'),
            projectId: PROJECT_A,
            count: 4,
          }),
        ])

        expect(await repository.getDailyTransactionCount(PROJECT_A)).toEqual([
          {
            count: 3,
            timestamp: today,
          },
          {
            count: 3,
            timestamp: today.add(1, 'days'),
          },
          {
            count: 4,
            timestamp: today.add(2, 'days'),
          },
        ])
      })

      it('orders by day', async () => {
        const today = UnixTime.now().toStartOf('day')

        await repository.addMany([
          fakeTransactionCount({
            blockNumber: 3,
            timestamp: today.add(1, 'days').add(1, 'hours'),
            projectId: PROJECT_A,
            count: 3,
          }),
          fakeTransactionCount({
            blockNumber: 1,
            timestamp: today.add(1, 'hours'),
            projectId: PROJECT_A,
            count: 1,
          }),
        ])

        expect(await repository.getDailyTransactionCount(PROJECT_A)).toEqual([
          {
            count: 1,
            timestamp: today,
          },
          {
            count: 3,
            timestamp: today.add(1, 'days'),
          },
        ])
      })
    },
  )
})

export function fakeTransactionCount(
  txCount?: Partial<BlockTransactionCountRecord>,
): BlockTransactionCountRecord {
  return {
    projectId: ProjectId('fake-project'),
    timestamp: new UnixTime(0),
    blockNumber: 0,
    count: Math.floor(Math.random() * 10),
    ...txCount,
  }
}
