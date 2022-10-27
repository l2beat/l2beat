import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { BlockTipRepository } from '../../../src/peripherals/database/BlockTipRepository'
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
    new BlockTipRepository(database, Logger.SILENT),
  )

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    BlockTransactionCountRepository.prototype.getGapsByProject.name,
    () => {
      it('works with no data', async () => {
        expect(await repository.getGapsByProject(PROJECT_A, 1, 5)).toEqual([
          [1, 5],
        ])
      })

      it('finds gaps with a single project', async () => {
        const min = 100
        const max = 400
        const total = (max - min) / 2
        const first = min - 10
        const last = max + 10

        const numbers = Array.from({ length: total }, () =>
          Math.floor(Math.random() * (max - min) + min),
        ).filter((x, i, a) => a.indexOf(x) === i)

        await repository.addMany(
          numbers.map((number) =>
            fakeTransactionCount({
              projectId: PROJECT_A,
              blockNumber: number,
            }),
          ),
        )

        const gaps = await repository.getGapsByProject(PROJECT_A, first, last)

        for (const [start, end] of gaps) {
          for (let i = start; i <= end; i++) {
            expect(numbers.includes(i)).toEqual(false)
          }
        }
      })

      it('finds holes with multiple projects', async () => {
        await repository.addMany([
          fakeTransactionCount({ blockNumber: 0, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 1, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 3, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 6, projectId: PROJECT_A }),
          fakeTransactionCount({ blockNumber: 0, projectId: PROJECT_B }),
          fakeTransactionCount({ blockNumber: 4, projectId: PROJECT_B }),
        ])

        expect(await repository.getGapsByProject(PROJECT_A, 0, 8)).toEqual([
          [2, 2],
          [4, 5],
          [7, 8],
        ])
        expect(await repository.getGapsByProject(PROJECT_B, 0, 4)).toEqual([
          [1, 3],
        ])
      })
    },
  )

  describe(
    BlockTransactionCountRepository.prototype.getDailyCountsByProject.name,
    () => {
      it('works with empty repository', async () => {
        await repository.refreshDailyCounts([PROJECT_A])
        expect(await repository.getDailyCountsByProject(PROJECT_A)).toEqual([])
      })

      it('skips last day', async () => {
        const start = UnixTime.now().toStartOf('day')
        const syncedCounts = [
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
        const lastDayCounts = [
          fakeTransactionCount({
            blockNumber: 3,
            timestamp: start.add(1, 'days'),
            projectId: PROJECT_A,
          }),
          fakeTransactionCount({
            blockNumber: 4,
            timestamp: start.add(1, 'days').add(1, 'hours'),
            projectId: PROJECT_A,
          }),
          fakeTransactionCount({
            blockNumber: 5,
            timestamp: start.add(1, 'days').add(2, 'hours'),
            projectId: PROJECT_A,
          }),
        ]
        await repository.addMany([...syncedCounts, ...lastDayCounts])

        await repository.refreshDailyCounts([PROJECT_A, PROJECT_B])

        expect(await repository.getDailyCountsByProject(PROJECT_A)).toEqual([
          {
            timestamp: start,
            count: syncedCounts.reduce((acc, record) => acc + record.count, 0),
          },
        ])
      })

      it('counts only for requested project', async () => {
        const start = UnixTime.now().toStartOf('day')
        const syncedCounts = [
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
        const aCounts = [
          ...syncedCounts,
          fakeTransactionCount({
            blockNumber: 3,
            timestamp: start.add(1, 'days'),
            projectId: PROJECT_A,
          }),
        ]
        const bCounts = [
          fakeTransactionCount({
            blockNumber: 1,
            projectId: PROJECT_B,
            timestamp: start.add(1, 'hours'),
          }),
          fakeTransactionCount({
            blockNumber: 2,
            projectId: PROJECT_B,
            timestamp: start.add(2, 'hours'),
          }),
          fakeTransactionCount({
            blockNumber: 3,
            projectId: PROJECT_B,
            timestamp: start.add(1, 'days'),
          }),
        ]
        await repository.addMany([...aCounts, ...bCounts])

        await repository.refreshDailyCounts([PROJECT_A, PROJECT_B])

        expect(await repository.getDailyCountsByProject(PROJECT_A)).toEqual([
          {
            timestamp: start,
            count: syncedCounts.reduce((acc, record) => acc + record.count, 0),
          },
        ])
      })

      it('groups by day', async () => {
        const start = UnixTime.now().toStartOf('day')

        await repository.addMany([
          fakeTransactionCount({
            blockNumber: 1,
            timestamp: start.add(1, 'hours'),
            projectId: PROJECT_A,
            count: 1,
          }),
          fakeTransactionCount({
            blockNumber: 2,
            timestamp: start.add(1, 'days').add(-1, 'seconds'),
            projectId: PROJECT_A,
            count: 2,
          }),
          fakeTransactionCount({
            blockNumber: 3,
            timestamp: start.add(1, 'days').add(1, 'hours'),
            projectId: PROJECT_A,
            count: 3,
          }),
          fakeTransactionCount({
            blockNumber: 4,
            timestamp: start.add(2, 'days'),
            projectId: PROJECT_A,
            count: 4,
          }),
        ])

        await repository.refreshDailyCounts([PROJECT_A])

        expect(await repository.getDailyCountsByProject(PROJECT_A)).toEqual([
          {
            count: 3,
            timestamp: start,
          },
          {
            count: 3,
            timestamp: start.add(1, 'days'),
          },
        ])
      })

      it('orders by day', async () => {
        const start = UnixTime.now().toStartOf('day')

        await repository.addMany([
          fakeTransactionCount({
            blockNumber: 3,
            timestamp: start.add(2, 'days'),
            projectId: PROJECT_A,
            count: 3,
          }),
          fakeTransactionCount({
            blockNumber: 2,
            timestamp: start.add(1, 'days').add(1, 'hours'),
            projectId: PROJECT_A,
            count: 3,
          }),
          fakeTransactionCount({
            blockNumber: 1,
            timestamp: start.add(1, 'hours'),
            projectId: PROJECT_A,
            count: 1,
          }),
        ])

        await repository.refreshDailyCounts([PROJECT_A])

        expect(await repository.getDailyCountsByProject(PROJECT_A)).toEqual([
          {
            count: 1,
            timestamp: start,
          },
          {
            count: 3,
            timestamp: start.add(1, 'days'),
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
