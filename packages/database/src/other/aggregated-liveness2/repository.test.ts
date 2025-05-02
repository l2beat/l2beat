import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import { AggregatedLiveness2Repository } from './repository'
import type { AggregatedLiveness2Record } from './entity'
import { AggregatedLivenessRepository } from '../aggregated-liveness/repository'

describeDatabase(AggregatedLiveness2Repository.name, (db) => {
  const repository = db.aggregatedLiveness2

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const START = UnixTime.now()
  const DATA = [
    {
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      min: 10,
      avg: 10,
      max: 10,
      timestamp: START - 1 * UnixTime.HOUR,
    },
    {
      projectId: PROJECT_B,
      subtype: 'stateUpdates',
      min: 10,
      avg: 10,
      max: 10,
      timestamp: START - 2 * UnixTime.HOUR,
    },
  ] as const satisfies AggregatedLiveness2Record[]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.upsertMany(DATA)
  })

  describe(AggregatedLiveness2Repository.prototype.upsertMany.name, () => {
    it('add new and update existing', async () => {
      const newRows: AggregatedLiveness2Record[] = [
        // to update
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 20,
          avg: 20,
          max: 20,
          timestamp: START - 1 * UnixTime.HOUR,
        },
        // to add
        {
          projectId: PROJECT_B,
          subtype: 'stateUpdates',
          min: 10,
          avg: 10,
          max: 10,
          timestamp: START - 4 * UnixTime.HOUR,
        },
      ]

      await repository.upsertMany(newRows)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        newRows[0]!,
        {
          projectId: PROJECT_B,
          subtype: 'stateUpdates',
          min: 10,
          avg: 10,
          max: 10,
          timestamp: START - 2 * UnixTime.HOUR,
        },
        newRows[1]!,
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

  describe(AggregatedLiveness2Repository.prototype.getByProjectIds.name, () => {
    it('should return all rows for projects', async () => {
      const results = await repository.getByProjectIds([PROJECT_A])

      expect(results).toEqualUnsorted([DATA[0]!])
    })

    it('should return empty array if no projects', async () => {
      await repository.deleteAll()
      const results = await repository.getByProjectIds([])

      expect(results).toEqualUnsorted([])
    })
  })

  describe(AggregatedLiveness2Repository.prototype.getByProjectIdSubtypeAndRange
    .name, () => {
    it('returns rows within the specified range for a project and subtype', async () => {
      const rangeStart = START - 1 * UnixTime.HOUR
      const rangeEnd = START - 1 * UnixTime.HOUR
      const results = await repository.getByProjectIdSubtypeAndRange(
        PROJECT_A,
        'batchSubmissions',
        [rangeStart, rangeEnd],
      )

      expect(results).toEqual([DATA[0]])
    })

    it('should return empty array if no records match the range', async () => {
      const rangeStart = START - 5 * UnixTime.HOUR
      const rangeEnd = START - 4 * UnixTime.HOUR
      const results = await repository.getByProjectIdSubtypeAndRange(
        PROJECT_A,
        'batchSubmissions',
        [rangeStart, rangeEnd],
      )

      expect(results).toEqual([])
    })

    it('should return empty array if project id does not exist', async () => {
      const rangeStart = START - 1 * UnixTime.HOUR
      const rangeEnd = START - 1 * UnixTime.HOUR
      const results = await repository.getByProjectIdSubtypeAndRange(
        ProjectId('non-existent'),
        'batchSubmissions',
        [rangeStart, rangeEnd],
      )

      expect(results).toEqual([])
    })

    it('should handle inclusive range boundaries, sorted ascending by timestamp', async () => {
      const dataWithBoundaries = [
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 1,
          avg: 1,
          max: 1,
          timestamp: START,
        },
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 2,
          avg: 2,
          max: 2,
          timestamp: START + 1 * UnixTime.HOUR,
        },
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          min: 3,
          avg: 3,
          max: 3,
          timestamp: START + 2 * UnixTime.HOUR,
        },
      ] as const satisfies AggregatedLiveness2Record[]
      await repository.upsertMany(dataWithBoundaries)

      const rangeStart = START + 1 * UnixTime.HOUR
      const rangeEnd = START + 2 * UnixTime.HOUR
      const results = await repository.getByProjectIdSubtypeAndRange(
        PROJECT_A,
        'batchSubmissions',
        [rangeStart, rangeEnd],
      )

      expect(results).toEqualUnsorted([
        dataWithBoundaries[1],
        dataWithBoundaries[2],
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
