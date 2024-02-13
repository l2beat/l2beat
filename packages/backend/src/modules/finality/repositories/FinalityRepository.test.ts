import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { FinalityRecord, FinalityRepository } from './FinalityRepository'

describeDatabase(FinalityRepository.name, (database) => {
  const repository = new FinalityRepository(database, Logger.SILENT)
  const START = UnixTime.now()

  const DATA: FinalityRecord[] = [
    {
      projectId: ProjectId('project-a'),
      timestamp: UnixTime.fromDate(new Date('2021-01-01T00:00:00Z')),
      minimumTimeToInclusion: 1,
      maximumTimeToInclusion: 3,
      averageTimeToInclusion: 2,
    },
    {
      projectId: ProjectId('project-a'),
      timestamp: UnixTime.fromDate(new Date('2021-01-01T01:00:00Z')),
      minimumTimeToInclusion: 2,
      maximumTimeToInclusion: 4,
      averageTimeToInclusion: 3,
    },
    {
      projectId: ProjectId('project-a'),
      timestamp: UnixTime.fromDate(new Date('2021-01-01T02:00:00Z')),
      minimumTimeToInclusion: 4,
      maximumTimeToInclusion: 8,
      averageTimeToInclusion: 6,
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.addMany(DATA)
  })

  describe(FinalityRepository.prototype.addMany.name, () => {
    it('adds new rows', async () => {
      const newRows = [
        {
          projectId: ProjectId('project-c'),
          timestamp: UnixTime.fromDate(new Date('2021-01-01T03:00:00Z')),
          minimumTimeToInclusion: 1,
          maximumTimeToInclusion: 3,
          averageTimeToInclusion: 2,
        },
        {
          projectId: ProjectId('project-c'),
          timestamp: UnixTime.fromDate(new Date('2021-01-01T04:00:00Z')),
          minimumTimeToInclusion: 2,
          maximumTimeToInclusion: 4,
          averageTimeToInclusion: 3,
        },
      ]
      await repository.addMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([...DATA, ...newRows])
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('big query', async () => {
      const records: FinalityRecord[] = []
      for (let i = 0; i < 15_000; i++) {
        records.push({
          timestamp: START.add(-i, 'hours'),
          projectId: ProjectId('project-a'),
          averageTimeToInclusion: i,
          maximumTimeToInclusion: i + 1,
          minimumTimeToInclusion: i - 1,
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  describe(FinalityRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(DATA)
    })
  })

  describe(
    FinalityRepository.prototype.findProjectFinalityOnTimestamp.name,
    () => {
      it('finds a record', async () => {
        const target = UnixTime.fromDate(new Date('2021-01-01T01:00:00Z'))

        const result = await repository.findProjectFinalityOnTimestamp(
          ProjectId('project-a'),
          target,
        )
        expect(result).toEqual({
          minimumTimeToInclusion: 2,
          maximumTimeToInclusion: 4,
          averageTimeToInclusion: 3,
        })
      })

      it('returns undefined if not found', async () => {
        const target = UnixTime.fromDate(new Date('2025-01-01T01:00:00Z'))

        const result = await repository.findProjectFinalityOnTimestamp(
          ProjectId('project-a'),
          target,
        )
        expect(result).toEqual(undefined)
      })
    },
  )

  describe(
    FinalityRepository.prototype.getProjectsSyncedOnTimestamp.name,
    () => {
      it('should return all projects ids which record on a given timestamp', async () => {
        const target = UnixTime.fromDate(new Date('2021-01-01T01:00:00Z'))
        const newRow = [
          {
            projectId: ProjectId('project-c'),
            timestamp: target,
            minimumTimeToInclusion: 2,
            maximumTimeToInclusion: 4,
            averageTimeToInclusion: 3,
          },
        ]
        await repository.addMany(newRow)

        const results = await repository.getProjectsSyncedOnTimestamp(target)

        expect(results).toEqualUnsorted([
          ProjectId('project-a'),
          ProjectId('project-c'),
        ])
      })
    },
  )

  describe(FinalityRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
