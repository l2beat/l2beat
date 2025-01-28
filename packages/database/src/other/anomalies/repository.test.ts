import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { AnomalyRecord } from './entity'
import { AnomaliesRepository } from './repository'

describeDatabase(AnomaliesRepository.name, (db) => {
  const repository = db.anomalies

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const START = UnixTime.now()
  const DATA: AnomalyRecord[] = [
    {
      timestamp: START.add(-1, 'hours'),
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      duration: 100,
    },
    {
      timestamp: START.add(-2, 'hours'),
      projectId: PROJECT_B,
      subtype: 'proofSubmissions',
      duration: 100,
    },
    {
      timestamp: START.add(-3, 'hours'),
      projectId: PROJECT_B,
      subtype: 'proofSubmissions',
      duration: 100,
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.upsertMany(DATA)
  })

  describe(AnomaliesRepository.prototype.upsertMany.name, () => {
    it('add new and update existing', async () => {
      const newRows: AnomalyRecord[] = [
        // to update
        {
          timestamp: START.add(-1, 'hours'),
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          duration: 200,
        },
        //to add
        {
          timestamp: START.add(-4, 'hours'),
          projectId: PROJECT_B,
          subtype: 'proofSubmissions',
          duration: 100,
        },
      ]

      await repository.upsertMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        newRows[0]!,
        {
          timestamp: START.add(-2, 'hours'),
          projectId: PROJECT_B,
          subtype: 'proofSubmissions',
          duration: 100,
        },
        {
          timestamp: START.add(-3, 'hours'),
          projectId: PROJECT_B,
          subtype: 'proofSubmissions',
          duration: 100,
        },
        newRows[1]!,
      ])
    })

    it('empty array', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
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

  describe(AnomaliesRepository.prototype.getByProjectIdFrom.name, () => {
    it('should return all rows for project from timestamp', async () => {
      const results = await repository.getByProjectIdFrom(
        PROJECT_B,
        START.add(-2, 'hours'),
      )

      expect(results).toEqualUnsorted(DATA.slice(1, 2))
    })
  })

  describe(AnomaliesRepository.prototype.getByProjectIdsFrom.name, () => {
    it('should return all rows for projects from timestamp', async () => {
      const results = await repository.getByProjectIdsFrom(
        [PROJECT_B],
        START.add(-2, 'hours'),
      )

      expect(results).toEqualUnsorted(DATA.slice(1, 2))
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
