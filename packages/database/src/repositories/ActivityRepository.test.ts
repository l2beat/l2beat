import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import omit from 'lodash/omit'
import { describeDatabase } from '../test/database'
import { type ActivityRecord, ActivityRepository } from './ActivityRepository'

describeDatabase(ActivityRepository.name, (db) => {
  const repository = db.activity

  const START = UnixTime.now()

  describe(ActivityRepository.prototype.upsertMany.name, () => {
    it('adds new rows', async () => {
      await repository.upsertMany([
        record('a', START, 1, 2, 1, 2),
        record('a', START + 1 * UnixTime.DAY, 2, 2, 3, 4),
        record('a', START + 2 * UnixTime.DAY, 4, 5, 5, 6),
      ])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('a', START, 1, 2, 1, 2),
        record('a', START + 1 * UnixTime.DAY, 2, 2, 3, 4),
        record('a', START + 2 * UnixTime.DAY, 4, 5, 5, 6),
      ])
    })

    it('merges on conflict', async () => {
      await repository.upsertMany([
        record('a', START, 1, 2, 1, 2),
        record('a', START + 1 * UnixTime.DAY, 2, 2, 4, 5),
      ])
      await repository.upsertMany([record('a', START, 3, 3, 1, 3)])

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        record('a', START, 3, 3, 1, 3),
        record('a', START + 1 * UnixTime.DAY, 2, 2, 4, 5),
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
        record('a', START + 1 * UnixTime.DAY),
        record('a', START + 2 * UnixTime.DAY),
        record('a', START + 3 * UnixTime.DAY),
      ])

      await repository.deleteByProjectIdFrom(
        ProjectId('a'),
        START + 2 * UnixTime.DAY,
      )

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        record('a', START),
        record('a', START + 1 * UnixTime.DAY),
      ])
    })
  })

  describe(ActivityRepository.prototype.getByProjectAndTimeRange.name, () => {
    it('should return all rows in a given time range for a project', async () => {
      const records = [
        record('a', START),
        record('a', START + 1 * UnixTime.DAY),
        record('a', START + 2 * UnixTime.DAY),
        record('a', START + 3 * UnixTime.DAY),
      ]

      await repository.upsertMany(records)

      const results = await repository.getByProjectAndTimeRange(
        ProjectId('a'),
        [START + 1 * UnixTime.DAY, START + 2 * UnixTime.DAY],
      )

      expect(results).toEqual(records.slice(1, 3))
    })
  })

  describe(ActivityRepository.prototype.getMaxCountsForProjects.name, () => {
    it('should return max UOPS count for each project', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('a', START + 1 * UnixTime.DAY, 3, 4),
        record('a', START + 2 * UnixTime.DAY, 4, 7),
        record('b', START + 1 * UnixTime.DAY, 6, 6),
        record('b', START + 2 * UnixTime.DAY, 5, 8),
      ])

      const result = await repository.getMaxCountsForProjects()

      expect(result).toEqual({
        [ProjectId('a')]: {
          uopsCount: 7,
          uopsTimestamp: START + 2 * UnixTime.DAY,
          count: 4,
          countTimestamp: START + 2 * UnixTime.DAY,
        },
        [ProjectId('b')]: {
          uopsCount: 8,
          uopsTimestamp: START + 2 * UnixTime.DAY,
          count: 6,
          countTimestamp: START + 1 * UnixTime.DAY,
        },
      })
    })

    it('should return max UOPS count when uops is null', async () => {
      await repository.upsertMany([
        // uopsCount is null
        record('a', START, 1),
        record('a', START + 1 * UnixTime.DAY, 5),
        record('a', START + 2 * UnixTime.DAY, 4),
        // normal count bigger then uopsCount
        record('b', START + 1 * UnixTime.DAY, 2, 6),
        record('b', START + 2 * UnixTime.DAY, 8),
        // uopsCount was null in the past
        record('c', START + 1 * UnixTime.DAY, 4),
        record('c', START + 2 * UnixTime.DAY, 5, 9),
      ])

      const result = await repository.getMaxCountsForProjects()

      expect(result).toEqual({
        [ProjectId('a')]: {
          uopsCount: 5,
          uopsTimestamp: START + 1 * UnixTime.DAY,
          count: 5,
          countTimestamp: START + 1 * UnixTime.DAY,
        },
        [ProjectId('b')]: {
          uopsCount: 8,
          uopsTimestamp: START + 2 * UnixTime.DAY,
          count: 8,
          countTimestamp: START + 2 * UnixTime.DAY,
        },
        [ProjectId('c')]: {
          uopsCount: 9,
          uopsTimestamp: START + 2 * UnixTime.DAY,
          count: 5,
          countTimestamp: START + 2 * UnixTime.DAY,
        },
      })
    })
  })
  describe(
    ActivityRepository.prototype.getSummedUopsCountForProjectAndTimeRange.name,
    () => {
      it('should return summed count grouped by projectId for given time range', async () => {
        await repository.upsertMany([
          record('a', START, 1),
          record('a', START + 1 * UnixTime.DAY, 3, 4),
          record('a', START + 2 * UnixTime.DAY, 4, 6),
          // project without any uopsCount
          record('b', START + 1 * UnixTime.DAY, 2),
          record('b', START + 2 * UnixTime.DAY, 5),
        ])

        const result =
          await repository.getSummedUopsCountForProjectAndTimeRange(
            ProjectId('a'),
            [START, START + 2 * UnixTime.DAY],
          )

        expect(result).toEqual(11)
      })
    },
  )

  describe(ActivityRepository.prototype.getByProjectAndTimeRange.name, () => {
    it('should return all rows in a given time range', async () => {
      await repository.upsertMany([
        record('a', START),
        record('a', START + 1 * UnixTime.DAY),
        record('a', START + 2 * UnixTime.DAY),
      ])

      const results = await repository.getByProjectAndTimeRange(
        ProjectId('a'),
        [START, START + 1 * UnixTime.DAY],
      )

      expect(results).toEqual([
        record('a', START),
        record('a', START + 1 * UnixTime.DAY),
      ])
    })
  })

  describe(
    ActivityRepository.prototype.getByProjectIncludingDataPoint.name,
    () => {
      it('should return all rows including data point', async () => {
        await repository.upsertMany([
          record('a', START, 1, 1, 0, 10),
          record('a', START + 1 * UnixTime.DAY, 1, 2, 11, 20),
          record('a', START + 2 * UnixTime.DAY, 1, 1, 21, 30),
        ])

        const results = await repository.getByProjectIncludingDataPoint(
          ProjectId('a'),
          15,
        )

        expect(results).toEqual([
          record('a', START + 1 * UnixTime.DAY, 1, 2, 11, 20),
        ])
      })
    },
  )

  describe(ActivityRepository.prototype.getDailyCounts.name, () => {
    it('should return correct response for single project', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('a', START + 1 * UnixTime.DAY, 1),
        record('a', START + 2 * UnixTime.DAY, 1),
      ])

      const result = await repository.getDailyCounts()
      expect(result).toEqual([
        record('a', START, 1),
        record('a', START + 1 * UnixTime.DAY, 1),
        record('a', START + 2 * UnixTime.DAY, 1),
      ])
    })

    it('should return correct response for multiple projects', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('b', START, 3),
        record('a', START + 1 * UnixTime.DAY, 1),
        record('b', START + 1 * UnixTime.DAY, 2),
      ])

      const result = await repository.getDailyCounts()

      expect(result).toEqual([
        record('a', START, 1),
        record('b', START, 3),
        record('a', START + 1 * UnixTime.DAY, 1),
        record('b', START + 1 * UnixTime.DAY, 2),
      ])
    })
  })

  describe(ActivityRepository.prototype.getDailyCountsPerProject.name, () => {
    it('should filter by project', async () => {
      await repository.upsertMany([
        record('a', START, 1),
        record('b', START, 3),
        record('a', START + 1 * UnixTime.DAY, 1),
      ])

      const result = await repository.getDailyCountsPerProject(ProjectId('a'))
      expect(result).toEqual([
        record('a', START, 1),
        record('a', START + 1 * UnixTime.DAY, 1),
      ])
    })
  })

  describe(
    ActivityRepository.prototype.getProjectsAggregatedDailyCount.name,
    () => {
      it('should return correct response for single project', async () => {
        await repository.upsertMany([
          record('a', START, 1),
          record('b', START, 3),
          record('a', START + 1 * UnixTime.DAY, 1),
        ])

        const result = await repository.getProjectsAggregatedDailyCount([
          ProjectId('a'),
        ])
        expect(result).toEqual(
          [record('a', START, 1), record('a', START + 1 * UnixTime.DAY, 1)].map(
            (i) => omit(i, ['projectId', 'start', 'end', 'uopsCount']),
          ),
        )
      })

      it('should return correct response for multiple projects', async () => {
        await repository.upsertMany([
          record('a', START, 1),
          record('b', START, 3),
          record('a', START + 1 * UnixTime.DAY, 1),
          record('b', START + 1 * UnixTime.DAY, 3),
          record('c', START + 1 * UnixTime.DAY, 4),
          record('c', START + 2 * UnixTime.DAY, 2),
        ])

        const result = await repository.getProjectsAggregatedDailyCount([
          ProjectId('a'),
          ProjectId('b'),
          ProjectId('c'),
        ])
        expect(result).toEqual([
          { timestamp: START, count: 4 },
          { timestamp: START + 1 * UnixTime.DAY, count: 8 },
          { timestamp: START + 2 * UnixTime.DAY, count: 2 },
        ])
      })
    },
  )

  describe(ActivityRepository.prototype.getLatestProcessedBlock.name, () => {
    it('should return the latest processed block for a project', async () => {
      const projectId = ProjectId('a')
      const timestamp = UnixTime.now()

      await repository.upsertMany([
        record(projectId.toString(), timestamp, 1, null, 1, 100),
        record(
          projectId.toString(),
          timestamp + 1 * UnixTime.DAY,
          2,
          null,
          101,
          200,
        ),
        record(
          projectId.toString(),
          timestamp + 2 * UnixTime.DAY,
          3,
          null,
          201,
          300,
        ),
        record(
          ProjectId('other'),
          timestamp + 3 * UnixTime.DAY,
          4,
          null,
          301,
          400,
        ),
      ])

      const latestBlock = await repository.getLatestProcessedBlock(projectId)

      expect(latestBlock).toEqual(300)
    })

    it('should return undefined if no records exist for the project', async () => {
      const projectId = ProjectId('b')

      const latestBlock = await repository.getLatestProcessedBlock(projectId)

      expect(latestBlock).toEqual(undefined)
    })
  })

  afterEach(async function () {
    await repository.deleteAll()
  })
})

function record(
  projectId: string,
  timestamp: UnixTime,
  count = 1,
  uopsCount: number | null = null,
  start = 1,
  end = 2,
): ActivityRecord {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    uopsCount,
    start,
    end,
  }
}
