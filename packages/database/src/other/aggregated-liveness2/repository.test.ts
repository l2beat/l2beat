import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { AggregatedLivenessRepository } from '../aggregated-liveness/repository'
import type { AggregatedLiveness2Record } from './entity'
import { AggregatedLiveness2Repository } from './repository'

describeDatabase(AggregatedLiveness2Repository.name, (db) => {
  const repository = db.aggregatedLiveness2

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const START = UnixTime.toStartOf(UnixTime.now(), 'day')
  const DATA: AggregatedLiveness2Record[] = [
    // project A - batchSubmissions
    {
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      min: 10,
      avg: 20,
      max: 30,
      timestamp: START,
      numberOfRecords: 1,
    },
    {
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      min: 20,
      avg: 30,
      max: 40,
      timestamp: START - 1 * UnixTime.DAY,
      numberOfRecords: 4,
    },
    {
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      min: 30,
      avg: 40,
      max: 50,
      timestamp: START - 2 * UnixTime.DAY,
      numberOfRecords: 3,
    },
    {
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      min: 40,
      avg: 50,
      max: 60,
      timestamp: START - 3 * UnixTime.DAY,
      numberOfRecords: 2,
    },
    // project A - stateUpdates
    {
      projectId: PROJECT_A,
      subtype: 'stateUpdates',
      min: 30,
      avg: 40,
      max: 50,
      timestamp: START - 1 * UnixTime.DAY,
      numberOfRecords: 2,
    },
    {
      projectId: PROJECT_A,
      subtype: 'stateUpdates',
      min: 40,
      avg: 50,
      max: 60,
      timestamp: START - 2 * UnixTime.DAY,
      numberOfRecords: 1,
    },
    // project B - stateUpdates
    {
      projectId: PROJECT_B,
      subtype: 'stateUpdates',
      min: 10,
      avg: 10,
      max: 10,
      timestamp: START - 2 * UnixTime.DAY,
      numberOfRecords: 2,
    },
  ] as const satisfies AggregatedLiveness2Record[]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.upsertMany(DATA)
  })

  describe(AggregatedLiveness2Repository.prototype.upsertMany.name, () => {
    it('add new and update existing', async () => {
      const newRows = [
        // to update
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 20,
          avg: 20,
          max: 20,
          timestamp: START,
          numberOfRecords: 4,
        },
        // to add
        {
          projectId: PROJECT_B,
          subtype: 'stateUpdates',
          min: 10,
          avg: 10,
          max: 10,
          timestamp: START - 3 * UnixTime.DAY,
          numberOfRecords: 5,
        },
      ] as const satisfies AggregatedLiveness2Record[]

      await repository.upsertMany(newRows)
      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        newRows[0],
        ...DATA.slice(1),
        newRows[1],
      ])
    })

    it('empty array', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
    })
  })

  describe(AggregatedLiveness2Repository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(AggregatedLiveness2Repository.prototype.getAggregatesByTimeRange
    .name, () => {
    it('returns aggregates with correctly calculated weighted averages for a given time range, grouped by project and subtype', async () => {
      const results = await repository.getAggregatesByTimeRange([
        START - 2 * UnixTime.DAY,
        START,
      ])

      expect(results).toEqualUnsorted([
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 10,
          avg: 32, // 1 * 20 + 4 * 30 + 3 * 40 / 1 + 4 + 3 = 32.5 but sql round it down
          max: 50,
        },
        {
          projectId: PROJECT_A,
          subtype: 'stateUpdates',
          min: 30,
          avg: 43, // 2 * 40 + 1 * 50 / 2 + 1 = 43.(3) but sql round it down
          max: 60,
        },
        {
          projectId: PROJECT_B,
          subtype: 'stateUpdates',
          min: 10,
          avg: 10,
          max: 10,
        },
      ])
    })

    it('returns aggregates with null from', async () => {
      await repository.deleteAll()
      await repository.upsertMany([
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 10,
          avg: 20,
          max: 30,
          timestamp: START,
          numberOfRecords: 1,
        },
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 20,
          avg: 30,
          max: 40,
          timestamp: START - 1 * UnixTime.DAY,
          numberOfRecords: 4,
        },
      ])
      const results = await repository.getAggregatesByTimeRange([null, START])

      expect(results).toEqualUnsorted([
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 10,
          avg: 28, // 1 * 20 + 4 * 30/ 1 + 4 = 32.5 but sql round it down
          max: 40,
        },
      ])
    })
  })

  describe(AggregatedLivenessRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
