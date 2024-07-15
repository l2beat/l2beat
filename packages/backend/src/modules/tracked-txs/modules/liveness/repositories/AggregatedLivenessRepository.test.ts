import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../../../../test/database'
import {
  AggregatedLivenessRecord,
  AggregatedLivenessRepository,
} from './AggregatedLivenessRepository'

describeDatabase(AggregatedLivenessRepository.name, (database) => {
  const repository = new AggregatedLivenessRepository(database, Logger.SILENT)

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const START = UnixTime.now()
  const DATA: AggregatedLivenessRecord[] = [
    {
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      range: '30D',
      min: 10,
      avg: 10,
      max: 10,
      updatedAt: START.add(-1, 'hours'),
    },
    {
      projectId: PROJECT_B,
      subtype: 'stateUpdates',
      range: '30D',
      min: 10,
      avg: 10,
      max: 10,
      updatedAt: START.add(-2, 'hours'),
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.addOrUpdateMany(DATA)
  })

  describe(AggregatedLivenessRepository.prototype.addOrUpdateMany.name, () => {
    it('add new and update existing', async () => {
      const newRows: AggregatedLivenessRecord[] = [
        // to update
        {
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          range: '30D',
          min: 20,
          avg: 20,
          max: 20,
          updatedAt: START.add(-1, 'hours'),
        },
        // to add
        {
          projectId: PROJECT_B,
          subtype: 'stateUpdates',
          range: '90D',
          min: 10,
          avg: 10,
          max: 10,
          updatedAt: START.add(-4, 'hours'),
        },
      ]

      await repository.addOrUpdateMany(newRows)

      const results = await repository.getAll()

      expect(results).toEqualUnsorted([
        newRows[0],
        {
          projectId: PROJECT_B,
          subtype: 'stateUpdates',
          range: '30D',
          min: 10,
          avg: 10,
          max: 10,
          updatedAt: START.add(-2, 'hours'),
        },
        newRows[1],
      ])
    })

    it('empty array', async () => {
      await expect(repository.addOrUpdateMany([])).not.toBeRejected()
    })
  })

  describe(AggregatedLivenessRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(AggregatedLivenessRepository.prototype.getByProject.name, () => {
    it('should return all rows for project', async () => {
      const results = await repository.getByProject(PROJECT_B)

      expect(results).toEqualUnsorted(DATA.slice(1, 2))
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
