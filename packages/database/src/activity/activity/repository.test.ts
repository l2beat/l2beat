import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { ActivityRecord } from './entity'
import { ActivityRepository } from './repository'

describeDatabase(ActivityRepository.name, (db) => {
  const repository = db.activity

  const START = UnixTime.now()

  describe(ActivityRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        record('a', START, 1, 1, 2),
        record('a', START.add(1, 'days'), 2, 3, 4),
        record('a', START.add(2, 'days'), 4, 5, 6),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('a', START, 1, 1, 2),
        record('a', START.add(1, 'days'), 2, 3, 4),
        record('a', START.add(2, 'days'), 4, 5, 6),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        record('a', START, 1, 1, 2),
        record('a', START.add(1, 'days'), 2, 4, 5),
      ])
      await repository.upsertMany([record('a', START, 3, 1, 3)])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('a', START, 3, 1, 3),
        record('a', START.add(1, 'days'), 2, 4, 5),
      ])
    })
  })

  describe(ActivityRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })

  describe(ActivityRepository.prototype.deleteByProjectIdFrom.name, () => {
    it('should delete all rows after a given timestamp and projectId', async () => {
      await repository.upsertMany([
        record('a', START),
        record('a', START.add(1, 'days')),
        record('a', START.add(2, 'days')),
        record('a', START.add(3, 'days')),
      ])

      await repository.deleteByProjectIdFrom(
        ProjectId('a'),
        START.add(2, 'days'),
      )

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        record('a', START),
        record('a', START.add(1, 'days')),
      ])
    })
  })

  describe(ActivityRepository.prototype.getByProjectAndTimeRange.name, () => {
    it('should return all rows in a given time range', async () => {
      await repository.upsertMany([
        record('a', START),
        record('a', START.add(1, 'days')),
        record('a', START.add(2, 'days')),
      ])

      const results = await repository.getByProjectAndTimeRange(
        ProjectId('a'),
        [START, START.add(1, 'days')],
      )

      expect(results).toEqual([
        record('a', START),
        record('a', START.add(1, 'days')),
      ])
    })
  })

  describe(
    ActivityRepository.prototype.getByProjectIncludingDataPoint.name,
    () => {
      it('should return all rows including data point', async () => {
        await repository.upsertMany([
          record('a', START, 1, 0, 10),
          record('a', START.add(1, 'days'), 1, 11, 20),
          record('a', START.add(2, 'days'), 1, 21, 30),
        ])

        const results = await repository.getByProjectIncludingDataPoint(
          ProjectId('a'),
          15,
        )

        expect(results).toEqual([record('a', START.add(1, 'days'), 1, 11, 20)])
      })
    },
  )

  afterEach(async function () {
    await repository.deleteAll()
  })
})

function record(
  projectId: string,
  timestamp: UnixTime,
  count: number = 1,
  start: number = 1,
  end: number = 2,
): ActivityRecord {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    start,
    end,
  }
}
