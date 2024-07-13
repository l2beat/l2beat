import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../../../../test/database'
import { AnomaliesRecord, AnomaliesRepository } from './AnomaliesRepository'

describeDatabase(AnomaliesRepository.name, (database) => {
  const repository = new AnomaliesRepository(database, Logger.SILENT)

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const START = UnixTime.now()
  const DATA: AnomaliesRecord[] = [
    {
      timestamp: START.add(-1, 'hours'),
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      duration: 100,
    },
    {
      timestamp: START.add(-1, 'hours'),
      projectId: PROJECT_B,
      subtype: 'proofSubmissions',
      duration: 100,
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.addOrUpdateMany(DATA)
  })

  describe(AnomaliesRepository.prototype.addOrUpdateMany.name, () => {
    it('add new and update existing', async () => {
      const newRows: AnomaliesRecord[] = [
        // to update
        {
          timestamp: START.add(-1, 'hours'),
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          duration: 200,
        },
        {
          timestamp: START.add(-2, 'hours'),
          projectId: PROJECT_B,
          subtype: 'proofSubmissions',
          duration: 100,
        },
      ]

      await repository.addOrUpdateMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        {
          timestamp: START.add(-1, 'hours'),
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          duration: 200,
        },
        {
          timestamp: START.add(-1, 'hours'),
          projectId: PROJECT_B,
          subtype: 'proofSubmissions',
          duration: 100,
        },
        {
          timestamp: START.add(-2, 'hours'),
          projectId: PROJECT_B,
          subtype: 'proofSubmissions',
          duration: 100,
        },
      ])
    })

    it('empty array', async () => {
      await expect(repository.addOrUpdateMany([])).not.toBeRejected()
    })
  })

  describe(AnomaliesRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(AnomaliesRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
