import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { omit } from 'lodash'
import { describeDatabase } from '../test/database'
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
    it('should return all rows in a given time range for a project', async () => {
      const records = [
        record('a', START),
        record('a', START.add(1, 'days')),
        record('a', START.add(2, 'days')),
        record('a', START.add(3, 'days')),
      ]

      await repository.upsertMany(records)

      const results = await repository.getByProjectAndTimeRange(
        ProjectId('a'),
        [START.add(1, 'days'), START.add(2, 'days')],
      )

      expect(results).toEqual(records.slice(1, 3))
    })
  })

  describe(ActivityRepository.prototype.getMaxCountForProjects.name, () => {
    it('should return max count for each project', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('a', START.add(1, 'days'), 3),
        record('a', START.add(2, 'days'), 4),
        record('b', START.add(1, 'days'), 2),
        record('b', START.add(2, 'days'), 5),
      ])

      const result = await repository.getMaxCountForProjects()

      expect(result).toEqual({
        [ProjectId('a')]: { count: 4, timestamp: START.add(2, 'days') },
        [ProjectId('b')]: { count: 5, timestamp: START.add(2, 'days') },
      })
    })
  })

  describe(ActivityRepository.prototype.getSummedCountForProjectsAndTimeRange
    .name, () => {
    it('should return summed count grouped by projectId for given time range', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('a', START.add(1, 'days'), 3),
        record('a', START.add(2, 'days'), 4),
        record('b', START.add(1, 'days'), 2),
        record('b', START.add(2, 'days'), 5),
      ])

      const result = await repository.getSummedCountForProjectsAndTimeRange(
        [ProjectId('a'), ProjectId('b')],
        [START, START.add(2, 'days')],
      )

      expect(result).toEqualUnsorted([
        { projectId: ProjectId('a'), count: 4 },
        { projectId: ProjectId('b'), count: 2 },
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

  describe(ActivityRepository.prototype.getByProjectIncludingDataPoint
    .name, () => {
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
  })

  describe(ActivityRepository.prototype.getDailyCounts.name, () => {
    it('should return correct response for single project', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('a', START.add(1, 'days'), 1),
        record('a', START.add(2, 'days'), 1),
      ])

      const result = await repository.getDailyCounts()
      expect(result).toEqual([
        record('a', START, 1),
        record('a', START.add(1, 'days'), 1),
        record('a', START.add(2, 'days'), 1),
      ])
    })

    it('should return correct response for multiple projects', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('b', START, 3),
        record('a', START.add(1, 'days'), 1),
        record('b', START.add(1, 'days'), 2),
      ])

      const result = await repository.getDailyCounts()

      expect(result).toEqual([
        record('a', START, 1),
        record('b', START, 3),
        record('a', START.add(1, 'days'), 1),
        record('b', START.add(1, 'days'), 2),
      ])
    })
  })

  describe(ActivityRepository.prototype.getDailyCountsPerProject.name, () => {
    it('should filter by project', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('b', START, 3),
        record('a', START.add(1, 'days'), 1),
      ])

      const result = await repository.getDailyCountsPerProject(ProjectId('a'))
      expect(result).toEqual([
        record('a', START, 1),
        record('a', START.add(1, 'days'), 1),
      ])
    })
  })

  describe(ActivityRepository.prototype.getProjectsAggregatedDailyCount
    .name, () => {
    it('should return correct response for single project', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('b', START, 3),
        record('a', START.add(1, 'days'), 1),
      ])

      const result = await repository.getProjectsAggregatedDailyCount([
        ProjectId('a'),
      ])
      expect(result).toEqual(
        [record('a', START, 1), record('a', START.add(1, 'days'), 1)].map((i) =>
          omit(i, ['projectId', 'start', 'end']),
        ),
      )
    })

    it('should return correct response for multiple projects', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('b', START, 3),
        record('a', START.add(1, 'days'), 1),
        record('b', START.add(1, 'days'), 3),
        record('c', START.add(1, 'days'), 4),
        record('c', START.add(2, 'days'), 2),
      ])

      const result = await repository.getProjectsAggregatedDailyCount([
        ProjectId('a'),
        ProjectId('b'),
        ProjectId('c'),
      ])
      expect(result).toEqual([
        { timestamp: START, count: 4 },
        { timestamp: START.add(1, 'days'), count: 8 },
        { timestamp: START.add(2, 'days'), count: 2 },
      ])
    })
  })

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
