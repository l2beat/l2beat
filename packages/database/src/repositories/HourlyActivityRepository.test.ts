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
    it('adds the counts to stored hours', async () => {
      await repository.addMany([record('a', START, 10, 12)])

      await repository.addMany([
        record('a', START, 5, 6),
        record('a', START + HOUR, 3, 3),
      ])

      expect(
        await repository.getByProjectsAndTimeRange(
          [ProjectId('a')],
          [START, START + HOUR],
        ),
      ).toEqual([record('a', START, 15, 18), record('a', START + HOUR, 3, 3)])
    })

    it('keeps uops empty for a chain without them', async () => {
      await repository.addMany([record('a', START, 10, null)])

      await repository.addMany([record('a', START, 5, null)])

      expect(
        await repository.getByProjectsAndTimeRange(
          [ProjectId('a')],
          [START, START],
        ),
      ).toEqual([record('a', START, 15, null)])
    })
  })

  describe(
    HourlyActivityRepository.prototype.getByProjectsAndTimeRange.name,
    () => {
      it("returns the projects' hours within the range by time, both ends included", async () => {
        await repository.addMany([
          record('a', START, 1, 1),
          record('a', START + 1 * HOUR, 2, 2),
          record('b', START + 1 * HOUR, 5, 5),
          record('a', START + 2 * HOUR, 3, 3),
          record('c', START + 2 * HOUR, 6, 6),
          record('a', START + 3 * HOUR, 4, 4),
        ])

        const results = await repository.getByProjectsAndTimeRange(
          [ProjectId('a'), ProjectId('b')],
          [START + 1 * HOUR, START + 2 * HOUR],
        )

        expect(results).toEqualUnsorted([
          record('a', START + 1 * HOUR, 2, 2),
          record('b', START + 1 * HOUR, 5, 5),
          record('a', START + 2 * HOUR, 3, 3),
        ])
        expect(results.map((r) => r.timestamp)).toEqual([
          START + 1 * HOUR,
          START + 1 * HOUR,
          START + 2 * HOUR,
        ])
      })

      it('returns nothing for no projects', async () => {
        await repository.addMany([record('a', START, 1, 1)])

        expect(
          await repository.getByProjectsAndTimeRange([], [START, START]),
        ).toEqual([])
      })
    },
  )

  describe(HourlyActivityRepository.prototype.getFirstTimestamp.name, () => {
    it("returns the project's first hour, or nothing without hours", async () => {
      await repository.addMany([
        record('a', START + HOUR, 2, 2),
        record('a', START, 1, 1),
        record('b', START - HOUR, 3, 3),
      ])

      expect(await repository.getFirstTimestamp(ProjectId('a'))).toEqual(START)
      expect(await repository.getFirstTimestamp(ProjectId('c'))).toEqual(
        undefined,
      )
    })
  })

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
    return repository.getByProjectsAndTimeRange(
      [ProjectId(projectId)],
      [START, START + 3 * HOUR],
    )
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
