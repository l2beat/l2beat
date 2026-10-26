import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type HourlyActivityRecord,
  HourlyActivityRepository,
} from './HourlyActivityRepository'

describeDatabase(HourlyActivityRepository.name, (db) => {
  const repository = db.hourlyActivity

  const START = UnixTime.toStartOf(UnixTime.now(), 'hour')
  const HOUR = UnixTime.HOUR

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(HourlyActivityRepository.prototype.addMany.name, () => {
    it('adds the counts to stored hours and returns their totals', async () => {
      await repository.addMany([record('a', START, 10, 12)])

      const totals = await repository.addMany([
        record('a', START, 5, 6),
        record('a', START + HOUR, 3, 3),
      ])

      const expected = [
        record('a', START, 15, 18),
        record('a', START + HOUR, 3, 3),
      ]
      expect(totals).toEqualUnsorted(expected)
      expect(
        await repository.getByProjectAndTimeRange(ProjectId('a'), [
          START,
          START + HOUR,
        ]),
      ).toEqual(expected)
    })

    it('keeps uops empty for a chain without them', async () => {
      await repository.addMany([record('a', START, 10, null)])

      const totals = await repository.addMany([record('a', START, 5, null)])

      expect(totals).toEqual([record('a', START, 15, null)])
    })
  })

  describe(
    HourlyActivityRepository.prototype.getByProjectAndTimeRange.name,
    () => {
      it("returns the project's hours within the range, both ends included", async () => {
        await repository.addMany([
          record('a', START, 1, 1),
          record('a', START + 1 * HOUR, 2, 2),
          record('a', START + 2 * HOUR, 3, 3),
          record('a', START + 3 * HOUR, 4, 4),
          record('b', START + 1 * HOUR, 5, 5),
        ])

        const results = await repository.getByProjectAndTimeRange(
          ProjectId('a'),
          [START + 1 * HOUR, START + 2 * HOUR],
        )

        expect(results).toEqual([
          record('a', START + 1 * HOUR, 2, 2),
          record('a', START + 2 * HOUR, 3, 3),
        ])
      })
    },
  )

  describe(
    HourlyActivityRepository.prototype.deleteByProjectIdFrom.name,
    () => {
      it("deletes the project's hours from the timestamp on", async () => {
        await repository.addMany([
          record('a', START, 1, 1),
          record('a', START + 1 * HOUR, 2, 2),
          record('a', START + 2 * HOUR, 3, 3),
          record('b', START + 2 * HOUR, 4, 4),
        ])

        const deleted = await repository.deleteByProjectIdFrom(
          ProjectId('a'),
          START + 1 * HOUR,
        )

        expect(deleted).toEqual(2)
        expect(await hoursOf('a')).toEqual([record('a', START, 1, 1)])
        expect(await hoursOf('b')).toEqual([
          record('b', START + 2 * HOUR, 4, 4),
        ])
      })
    },
  )

  describe(
    HourlyActivityRepository.prototype.deleteByProjectIdUntil.name,
    () => {
      it("deletes the project's hours before the timestamp", async () => {
        await repository.addMany([
          record('a', START, 1, 1),
          record('a', START + 1 * HOUR, 2, 2),
          record('a', START + 2 * HOUR, 3, 3),
          record('b', START, 4, 4),
        ])

        const deleted = await repository.deleteByProjectIdUntil(
          ProjectId('a'),
          START + 2 * HOUR,
        )

        expect(deleted).toEqual(2)
        expect(await hoursOf('a')).toEqual([
          record('a', START + 2 * HOUR, 3, 3),
        ])
        expect(await hoursOf('b')).toEqual([record('b', START, 4, 4)])
      })
    },
  )

  function hoursOf(projectId: string) {
    return repository.getByProjectAndTimeRange(ProjectId(projectId), [
      START,
      START + 3 * HOUR,
    ])
  }
})

function record(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
): HourlyActivityRecord {
  return { projectId: ProjectId(projectId), timestamp, count, uopsCount }
}
