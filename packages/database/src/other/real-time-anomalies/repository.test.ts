import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { RealTimeAnomalyRecord } from './entity'
import { RealTimeAnomaliesRepository } from './repository'

describeDatabase(RealTimeAnomaliesRepository.name, (db) => {
  const repository = db.realTimeAnomalies

  const PROJECT_A = ProjectId('project-a')
  const PROJECT_B = ProjectId('project-b')

  const START = UnixTime.now()
  const DATA = [
    {
      start: START - 1 * UnixTime.HOUR,
      projectId: PROJECT_A,
      subtype: 'batchSubmissions',
      status: 'ongoing',
      isApproved: false,
      end: undefined,
    },
    {
      start: START - 2 * UnixTime.HOUR,
      projectId: PROJECT_B,
      subtype: 'stateUpdates',
      status: 'ongoing',
      isApproved: false,
      end: undefined,
    },
    {
      start: START - 2 * UnixTime.HOUR,
      projectId: PROJECT_B,
      subtype: 'batchSubmissions',
      status: 'ongoing',
      isApproved: true,
      end: undefined,
    },
    {
      start: START - 3 * UnixTime.HOUR,
      projectId: PROJECT_B,
      subtype: 'proofSubmissions',
      status: 'recovered',
      isApproved: true,
      end: START,
    },
  ] as const satisfies RealTimeAnomalyRecord[]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.upsertMany(DATA)
  })

  describe(RealTimeAnomaliesRepository.prototype.upsertMany.name, () => {
    it('add new and update existing', async () => {
      const newRows: RealTimeAnomalyRecord[] = [
        // to update
        {
          start: START - 1 * UnixTime.HOUR,
          projectId: PROJECT_A,
          subtype: 'batchSubmissions',
          status: 'ongoing',
          isApproved: true,
          end: undefined,
        },
        //to add
        {
          start: START - 4 * UnixTime.HOUR,
          projectId: PROJECT_B,
          subtype: 'proofSubmissions',
          status: 'ongoing',
          isApproved: false,
          end: undefined,
        },
      ]

      await repository.upsertMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([
        newRows[0]!,
        ...DATA.slice(1),
        { ...newRows[1]!, end: undefined },
      ])
    })

    it('empty array', async () => {
      await expect(repository.upsertMany([])).not.toBeRejected()
    })
  })

  describe(RealTimeAnomaliesRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(DATA)
    })
  })

  describe(
    RealTimeAnomaliesRepository.prototype.getOngoingAnomalies.name,
    () => {
      it('should return all ongoing anomalies', async () => {
        const results = await repository.getOngoingAnomalies()

        expect(results).toEqualUnsorted([DATA[0], DATA[1], DATA[2]])
      })
    },
  )

  describe(
    RealTimeAnomaliesRepository.prototype.getApprovedAnomaliesByProjectIds.name,
    () => {
      it('should return all approved and resolved anomalies', async () => {
        const results = await repository.getApprovedAnomaliesByProjectIds([
          PROJECT_B,
        ])
        expect(results).toEqualUnsorted([DATA[2]!, DATA[3]!])
      })

      it('should return empty array if no project ids', async () => {
        const results = await repository.getApprovedAnomaliesByProjectIds([])
        expect(results).toEqual([])
      })
    },
  )

  describe(
    RealTimeAnomaliesRepository.prototype.getApprovedAnomaliesByProjectIds.name,
    () => {
      it('should return all approved and resolved anomalies', async () => {
        const results = await repository.getApprovedAnomaliesByProjectIds([
          PROJECT_B,
        ])
        expect(results).toEqualUnsorted([DATA[2]!, DATA[3]!])
      })

      it('should return empty array if no project ids', async () => {
        const results = await repository.getApprovedAnomaliesByProjectIds([])
        expect(results).toEqual([])
      })
    },
  )

  describe(
    RealTimeAnomaliesRepository.prototype.getApprovedOngoingAnomalies.name,
    () => {
      it('should return all approved and ongoing anomalies', async () => {
        const results = await repository.getApprovedOngoingAnomalies()
        expect(results).toEqualUnsorted([DATA[2]!])
      })
    },
  )

  describe(RealTimeAnomaliesRepository.prototype.getProjectIds.name, () => {
    it('should return all projectIds', async () => {
      const results = await repository.getProjectIds()
      expect(results).toEqualUnsorted([PROJECT_A, PROJECT_B])
    })
  })

  describe(RealTimeAnomaliesRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })

  describe(RealTimeAnomaliesRepository.prototype.deleteByProjectId.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteByProjectId([PROJECT_B])

      const results = await repository.getAll()

      expect(results).toEqual([DATA[0]])
    })
  })
})
