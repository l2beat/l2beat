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
      minimum: 1,
      maximum: 3,
      average: 2,
    },
    {
      projectId: ProjectId('project-a'),
      timestamp: UnixTime.fromDate(new Date('2021-01-01T01:00:00Z')),
      minimum: 2,
      maximum: 4,
      average: 3,
    },
    {
      projectId: ProjectId('project-a'),
      timestamp: UnixTime.fromDate(new Date('2021-01-01T02:00:00Z')),
      minimum: 4,
      maximum: 8,
      average: 6,
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
          minimum: 1,
          maximum: 3,
          average: 2,
        },
        {
          projectId: ProjectId('project-c'),
          timestamp: UnixTime.fromDate(new Date('2021-01-01T04:00:00Z')),
          minimum: 2,
          maximum: 4,
          average: 3,
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
          average: i,
          maximum: i + 1,
          minimum: i - 1,
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
    FinalityRepository.prototype.getProjectsSyncedOnTimestamp.name,
    () => {
      it('should return all projects ids which record on a given timestamp', async () => {
        const target = UnixTime.fromDate(new Date('2021-01-01T01:00:00Z'))
        const newRow = [
          {
            projectId: ProjectId('project-c'),
            timestamp: target,
            minimum: 2,
            maximum: 4,
            average: 3,
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
