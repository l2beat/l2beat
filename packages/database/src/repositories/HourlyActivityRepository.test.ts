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

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(HourlyActivityRepository.prototype.addMany.name, () => {
    it('adds the counts to stored hours and keeps the larger peak', async () => {
      await repository.addMany([
        record('a', START, { count: 10, uops: 12, peak: 6, peakUops: 7 }),
      ])
      await repository.addMany([
        record('a', START, { count: 5, uops: 6, peak: 4, peakUops: 9 }),
        record('a', START + 1 * UnixTime.HOUR, {
          count: 3,
          uops: 3,
          peak: 2,
          peakUops: 2,
        }),
      ])

      const results = await repository.getByProjectAndTimeRange(
        ProjectId('a'),
        [START, START + 1 * UnixTime.HOUR],
      )

      expect(results).toEqual([
        record('a', START, { count: 15, uops: 18, peak: 6, peakUops: 9 }),
        record('a', START + 1 * UnixTime.HOUR, {
          count: 3,
          uops: 3,
          peak: 2,
          peakUops: 2,
        }),
      ])
    })

    it('keeps uops empty for a chain without them', async () => {
      const noUops = { uops: null, peakUops: null }
      await repository.addMany([
        record('a', START, { count: 10, peak: 6, ...noUops }),
      ])
      await repository.addMany([
        record('a', START, { count: 5, peak: 4, ...noUops }),
      ])

      const results = await repository.getByProjectAndTimeRange(
        ProjectId('a'),
        [START, START],
      )

      expect(results).toEqual([
        record('a', START, { count: 15, peak: 6, ...noUops }),
      ])
    })
  })

  describe(
    HourlyActivityRepository.prototype.getByProjectAndTimeRange.name,
    () => {
      it("returns the project's hours within the range, both ends included", async () => {
        await repository.addMany([
          record('a', START, counts(1)),
          record('a', START + 1 * UnixTime.HOUR, counts(2)),
          record('a', START + 2 * UnixTime.HOUR, counts(3)),
          record('a', START + 3 * UnixTime.HOUR, counts(4)),
          record('b', START + 1 * UnixTime.HOUR, counts(5)),
        ])

        const results = await repository.getByProjectAndTimeRange(
          ProjectId('a'),
          [START + 1 * UnixTime.HOUR, START + 2 * UnixTime.HOUR],
        )

        expect(results).toEqual([
          record('a', START + 1 * UnixTime.HOUR, counts(2)),
          record('a', START + 2 * UnixTime.HOUR, counts(3)),
        ])
      })
    },
  )

  describe(
    HourlyActivityRepository.prototype.deleteByProjectIdFrom.name,
    () => {
      it("deletes the project's hours from the timestamp on", async () => {
        await repository.addMany([
          record('a', START, counts(1)),
          record('a', START + 1 * UnixTime.HOUR, counts(2)),
          record('a', START + 2 * UnixTime.HOUR, counts(3)),
          record('b', START + 2 * UnixTime.HOUR, counts(4)),
        ])

        const deleted = await repository.deleteByProjectIdFrom(
          ProjectId('a'),
          START + 1 * UnixTime.HOUR,
        )

        expect(deleted).toEqual(2)
        expect(
          await repository.getByProjectAndTimeRange(ProjectId('a'), [
            START,
            START + 2 * UnixTime.HOUR,
          ]),
        ).toEqual([record('a', START, counts(1))])
        expect(
          await repository.getByProjectAndTimeRange(ProjectId('b'), [
            START,
            START + 2 * UnixTime.HOUR,
          ]),
        ).toEqual([record('b', START + 2 * UnixTime.HOUR, counts(4))])
      })
    },
  )
})

interface Counts {
  count: number
  uops: number | null
  peak: number
  peakUops: number | null
}

/** The same value everywhere, for tests about which rows come back */
function counts(value: number): Counts {
  return { count: value, uops: value, peak: value, peakUops: value }
}

function record(
  projectId: string,
  timestamp: UnixTime,
  { count, uops, peak, peakUops }: Counts,
): HourlyActivityRecord {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    uopsCount: uops,
    peakCount: peak,
    peakUopsCount: peakUops,
  }
}
