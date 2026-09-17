import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it } from 'vitest'
import { describeDatabase } from '../test/database'
import {
  type AnomalyStatsRecord,
  AnomalyStatsRepository,
} from './AnomalyStatsRepository'

describeDatabase(AnomalyStatsRepository.name, (db) => {
  const repository = db.anomalyStats

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const START = UnixTime.now()
  const DATA: AnomalyStatsRecord[] = [
    {
      timestamp: START - 1 * UnixTime.HOUR,
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      mean: 10,
      stdDev: 12,
    },
    {
      timestamp: START - 2 * UnixTime.HOUR,
      projectId: PROJECT_B,
      subtype: 'proofSubmissions',
      mean: 20,
      stdDev: 22,
    },
    {
      timestamp: START - 3 * UnixTime.HOUR,
      projectId: PROJECT_B,
      subtype: 'proofSubmissions',
      mean: 30,
      stdDev: 33,
    },
  ]

  beforeEach(async () => {
    await repository.deleteAll()
    await repository.upsertMany(DATA)
  })

  describe(AnomalyStatsRepository.prototype.upsertMany.name, () => {
    it('add new and update existing', async () => {
      const newRows: AnomalyStatsRecord[] = [
        // to update
        {
          timestamp: START - 1 * UnixTime.HOUR,
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          mean: 1,
          stdDev: 2,
        },
        //to add
        {
          timestamp: START - 4 * UnixTime.HOUR,
          projectId: PROJECT_B,
          subtype: 'proofSubmissions',
          mean: 40,
          stdDev: 44,
        },
      ]

      await repository.upsertMany(newRows)

      const results = await repository.getAll()
      expect(results).toHaveLength(4)
      expect(results).toEqual(
        expect.arrayContaining([
          newRows[0]!,
          {
            timestamp: START - 2 * UnixTime.HOUR,
            projectId: PROJECT_B,
            subtype: 'proofSubmissions',
            mean: 20,
            stdDev: 22,
          },
          {
            timestamp: START - 3 * UnixTime.HOUR,
            projectId: PROJECT_B,
            subtype: 'proofSubmissions',
            mean: 30,
            stdDev: 33,
          },
          newRows[1]!,
        ]),
      )
    })

    it('empty array', async () => {
      await expect(repository.upsertMany([])).resolves.not.toThrow()
    })
  })

  describe(AnomalyStatsRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      const expected = DATA.map((e) => ({
        ...e,
      }))
      expect(results).toHaveLength(expected.length)
      expect(results).toEqual(expect.arrayContaining(expected))
    })
  })

  describe(
    AnomalyStatsRepository.prototype.getLatestByProjectIdAndSubtype.name,
    () => {
      it('should return latest for project and subtype', async () => {
        const result = await repository.getLatestByProjectIdAndSubtype(
          PROJECT_B,
          'proofSubmissions',
        )

        expect(result).toEqual(DATA[1])
      })
    },
  )

  describe(AnomalyStatsRepository.prototype.getLatestStats.name, () => {
    it('should return latest stats', async () => {
      const result = await repository.getLatestStats()

      expect(result).toEqual([DATA[0]!, DATA[1]!])
    })
  })

  describe(AnomalyStatsRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
