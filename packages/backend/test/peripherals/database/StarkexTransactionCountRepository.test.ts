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
        const record = fakeStarkexTransactionCount({
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
          fakeStarkexTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(0),
          }),
          fakeStarkexTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(10),
          }),
          fakeStarkexTransactionCount({
            projectId: PROJECT_A,
            timestamp: UnixTime.fromDays(11),
          }),
          fakeStarkexTransactionCount({
            projectId: PROJECT_B,
            timestamp: UnixTime.fromDays(100),
          }),
          fakeStarkexTransactionCount({
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
            fakeStarkexTransactionCount({
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
})

function fakeStarkexTransactionCount(
  record?: Partial<StarkexTransactionCountRecord>,
): StarkexTransactionCountRecord {
  return {
    projectId: ProjectId('fake-project'),
    timestamp: new UnixTime(0),
    count: Math.floor(Math.random() * 100),
    ...record,
  }
}
