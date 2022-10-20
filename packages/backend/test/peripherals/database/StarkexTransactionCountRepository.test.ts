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

  beforeEach(async () => {
    await repository.deleteAll()
  })

  describe(
    StarkexTransactionCountRepository.prototype.getGapsByProject.name,
    () => {
      it('works with no data', async () => {
        expect(await repository.getGapsByProject(PROJECT_A)).toEqual([])
      })

      it('finds gaps with a single project', async () => {
        const maxNumber = 1000
        const numbers = Array.from({ length: 200 }, () =>
          Math.floor(Math.random() * maxNumber),
        ).filter((x, i, a) => a.indexOf(x) === i)

        numbers.map((number) =>
          fakeTransactionCount({
            timestamp: UnixTime.fromDays(number),
            projectId: PROJECT_A,
          }),
        )

        const gaps = await repository.getGapsByProject(PROJECT_A)

        for (const [start, end] of gaps) {
          for (let i = start; i <= end; i++) {
            expect(numbers.includes(i)).toEqual(false)
          }
        }
      })

      it('finds holes with multiple projects', async () => {
        await repository.addMany([
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
            timestamp: UnixTime.fromDays(20),
          }),
        ])

        expect(await repository.getGapsByProject(PROJECT_A)).toEqual([[1, 9]])
        expect(await repository.getGapsByProject(PROJECT_B)).toEqual([[21, 99]])
      })
    },
  )

  describe(
    StarkexTransactionCountRepository.prototype.findBoundariesByProject.name,
    () => {
      it('works with no data', async () => {
        expect(
          await repository.findBoundariesByProject(PROJECT_A),
        ).not.toBeDefined()
      })

      it('returns min and max for single project', async () => {
        await repository.addMany([
          fakeTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(1),
          }),
          fakeTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(3),
          }),
          fakeTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(5),
          }),
        ])

        const boundaries = await repository.findBoundariesByProject(PROJECT_A)

        expect(boundaries).toEqual({ min: 1, max: 5 })
      })

      it('returns min and max with multiple projects', async () => {
        await repository.addMany([
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
            timestamp: UnixTime.fromDays(20),
          }),
        ])

        expect(await repository.findBoundariesByProject(PROJECT_A)).toEqual({
          min: 0,
          max: 11,
        })
        expect(await repository.findBoundariesByProject(PROJECT_B)).toEqual({
          min: 20,
          max: 100,
        })
      })
    },
  )

  describe(
    StarkexTransactionCountRepository.prototype.getDailyCountsByProject.name,
    () => {
      it('works with empty repository', async () => {
        expect(await repository.getDailyCountsByProject(PROJECT_A)).toEqual([])
      })

      it('counts only for requested project', async () => {
        const start = UnixTime.now().toStartOf('day')
        const aCounts = [
          fakeTransactionCount({
            timestamp: start,
            projectId: PROJECT_A,
            count: 100,
          }),
          fakeTransactionCount({
            timestamp: start.add(1, 'days'),
            projectId: PROJECT_A,
            count: 101,
          }),
        ]
        const bCounts = [
          fakeTransactionCount({
            timestamp: start,

            projectId: PROJECT_B,
          }),
          fakeTransactionCount({
            timestamp: start.add(1, 'days'),
            projectId: PROJECT_B,
          }),
        ]
        await repository.addMany([...aCounts, ...bCounts])

        expect(await repository.getDailyCountsByProject(PROJECT_A)).toEqual(
          aCounts.map(({ timestamp, count }) => ({ timestamp, count })),
        )
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
