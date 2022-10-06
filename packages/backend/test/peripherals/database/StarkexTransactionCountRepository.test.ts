import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import {
  StarkexTransactionCountRecord,
  StarkexTransactionCountRepository,
} from '../../../src/peripherals/database/StarkexTransactionCountRepository'
import { setupDatabaseTestSuite } from './shared/setup'

describe(StarkexTransactionCountRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new StarkexTransactionCountRepository(
    database,
    Logger.SILENT,
  )

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')
  const TODAY = UnixTime.now().toStartOf('day')

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    StarkexTransactionCountRepository.prototype.getMissingRangesByProject.name,
    () => {
      it('works with an empty repository', async () => {
        expect(await repository.getMissingRangesByProject(PROJECT_A)).toEqual([
          [-Infinity, Infinity],
        ])
      })

      it('finds holes', async () => {
        const record = fakeTransactionCount({
          projectId: PROJECT_A,
          timestamp: UnixTime.fromDays(10),
        })

        await repository.add(record)

        const result = await repository.getMissingRangesByProject(PROJECT_A)
        expect(result).toEqual([
          [-Infinity, 10],
          [11, Infinity],
        ])
      })

      it('finds holes with multiple projects', async () => {
        const records = [
          fakeTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(0),
          }),
          fakeTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(10),
          }),
          fakeTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(11),
          }),
          fakeTransactionCount({
            projectId: PROJECT_B,
            timestamp: UnixTime.fromDays(100),
          }),
          fakeTransactionCount({
            projectId: PROJECT_B,
            timestamp: TODAY,
          }),
        ]

        await repository.addMany(records)

        expect(await repository.getMissingRangesByProject(PROJECT_A)).toEqual([
          [-Infinity, 0],
          [1, 10],
          [12, Infinity],
        ])
        expect(await repository.getMissingRangesByProject(PROJECT_B)).toEqual([
          [-Infinity, 100],
          [101, TODAY.toDays()],
          [TODAY.toDays() + 1, Infinity],
        ])
      })

      it('finds holes on a big set', async () => {
        const numbers = Array.from({ length: 200 }, () =>
          Math.floor(Math.random() * 1000),
        ).filter((x, i, a) => a.indexOf(x) === i)

        await repository.addMany(
          numbers.map((number) =>
            fakeTransactionCount({
              timestamp: UnixTime.fromDays(number),
              projectId: PROJECT_A,
            }),
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
    StarkexTransactionCountRepository.prototype.getDailyTransactionCount.name,
    () => {
      it('works with empty repository', async () => {
        expect(await repository.getDailyTransactionCount(PROJECT_A)).toEqual([])
      })

      it('counts only for requested project', async () => {
        const start = UnixTime.now().toStartOf('day')
        const aCounts = [
          fakeTransactionCount({
            timestamp: start.add(1, 'hours'),
            projectId: PROJECT_A,
          }),
          fakeTransactionCount({
            timestamp: start.add(2, 'hours'),
            projectId: PROJECT_A,
          }),
        ]
        const bCounts = [
          fakeTransactionCount({
            timestamp: start.add(1, 'hours'),

            projectId: PROJECT_B,
          }),
          fakeTransactionCount({
            timestamp: start.add(3, 'hours'),
            projectId: PROJECT_B,
          }),
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
            timestamp: today.add(1, 'hours'),
            projectId: PROJECT_A,
            count: 1,
          }),
          fakeTransactionCount({
            timestamp: today.add(1, 'days').add(-1, 'seconds'),
            projectId: PROJECT_A,
            count: 2,
          }),
          fakeTransactionCount({
            timestamp: today.add(1, 'days').add(1, 'hours'),
            projectId: PROJECT_A,
            count: 3,
          }),
          fakeTransactionCount({
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
            timestamp: today.add(1, 'days').add(1, 'hours'),
            projectId: PROJECT_A,
            count: 3,
          }),
          fakeTransactionCount({
            timestamp: today,
            projectId: PROJECT_A,
            count: 1,
          }),
          fakeTransactionCount({
            timestamp: today.add(2, 'days'),
            projectId: PROJECT_A,
            count: 4,
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
          {
            count: 4,
            timestamp: today.add(2, 'days'),
          },
        ])
      })
    },
  )
})

function fakeTransactionCount(
  record?: Partial<StarkexTransactionCountRecord>,
): StarkexTransactionCountRecord {
  return {
    projectId: ProjectId('fake-project'),
    timestamp: new UnixTime(0),
    count: Math.floor(Math.random() * 100),
    ...record,
  }
}
