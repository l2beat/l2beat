import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { groupBy, mapValues, omit } from 'lodash'
import { describeDatabase } from '../../test/database'
import { BlockTransactionCountRecord } from '../activity-block/entity'
import { DailyTransactionCountRecord } from './entity'
import { ActivityViewRepository } from './repository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')
const PROJECT_C = ProjectId('project-c')

describeDatabase(ActivityViewRepository.name, (db) => {
  const repository = db.activityView

  beforeEach(async () => {
    // Delete all rows from all tables that are used in the view
    await db.blockTransactionCount.deleteAll()
    await db.zkSyncTransactionCount.deleteAll()
    await db.starkExTransactionCount.deleteAll()

    await repository.refresh()
  })

  describe(ActivityViewRepository.prototype.getDailyCounts.name, () => {
    it('view must be empty', async () => {
      const result = await repository.getDailyCounts()
      expect(result).toEqual([])
    })

    it('should return correct response for single project', async () => {
      await db.blockTransactionCount.upsertMany([
        mockBlockRecord(PROJECT_A, 0, 0, 1),
        mockBlockRecord(PROJECT_A, 1, 0, 2),
        mockBlockRecord(PROJECT_A, 2, 0, 3),
        mockBlockRecord(PROJECT_A, 2, 1, 4),
      ])

      await repository.refresh()

      const result = await repository.getDailyCounts()
      expect(result).toEqual([
        getDailyTransactionCountRecord(PROJECT_A, 0, 1),
        getDailyTransactionCountRecord(PROJECT_A, 1, 2),
        getDailyTransactionCountRecord(PROJECT_A, 2, 7),
      ])
    })

    it('should return correct response for multiple projects', async () => {
      await db.blockTransactionCount.upsertMany([
        mockBlockRecord(PROJECT_A, 0, 0, 1),
        mockBlockRecord(PROJECT_A, 1, 0, 2),
        mockBlockRecord(PROJECT_B, 1, 0, 3),
        mockBlockRecord(PROJECT_A, 2, 0, 4),
        mockBlockRecord(PROJECT_A, 2, 1, 5),
      ])

      await db.zkSyncTransactionCount.upsertMany([
        mockZkSyncRecord(1, 0),
        mockZkSyncRecord(1, 1),
        mockZkSyncRecord(2, 0),
        mockZkSyncRecord(2, 1),
        mockZkSyncRecord(2, 2),
      ])

      const starkExMockRecords = [
        mockStarkExRecord(PROJECT_C, 1, 0, 1),
        mockStarkExRecord(PROJECT_C, 1, 1, 2),
        mockStarkExRecord(PROJECT_C, 2, 0, 3),
        mockStarkExRecord(PROJECT_C, 3, 0, 4),
      ]
      await db.starkExTransactionCount.upsertMany(starkExMockRecords)

      const blockRelatedValues: DailyTransactionCountRecord[] = [
        getDailyTransactionCountRecord(PROJECT_A, 0, 1),
        getDailyTransactionCountRecord(PROJECT_A, 1, 2),
        getDailyTransactionCountRecord(PROJECT_B, 1, 3),
        getDailyTransactionCountRecord(PROJECT_A, 2, 9),
      ]

      await repository.refresh()

      const zkSyncRelatedValues: DailyTransactionCountRecord[] = [
        getDailyTransactionCountRecord('zksync', 1, 2),
        getDailyTransactionCountRecord('zksync', 2, 3),
      ]

      const result = await repository.getDailyCounts()

      // Must be sorted
      expect(result).toEqual(result.sort(projectIdCompare))

      const expectedValuesPerTimestamp =
        groupByTimestampAndSortByProjectIdInside([
          ...blockRelatedValues,
          ...zkSyncRelatedValues,
          ...starkExMockRecords,
        ])

      const resultPerTimestamp =
        groupByTimestampAndSortByProjectIdInside(result)

      expect(resultPerTimestamp).toEqual(expectedValuesPerTimestamp)
    })
  })

  describe(
    ActivityViewRepository.prototype.getDailyCountsPerProject.name,
    () => {
      it('should filter by project', async () => {
        await db.blockTransactionCount.upsertMany([
          mockBlockRecord(PROJECT_A, 0, 0, 1),
          mockBlockRecord(PROJECT_B, 0, 0, 1),
        ])

        await repository.refresh()

        const result = await repository.getDailyCountsPerProject(PROJECT_A)
        expect(result).toEqual([
          getDailyTransactionCountRecord(PROJECT_A, 0, 1),
        ])
      })
    },
  )

  describe(
    ActivityViewRepository.prototype.getProjectsAggregatedDailyCount.name,
    () => {
      it('should return correct response for single project', async () => {
        await db.blockTransactionCount.upsertMany([
          mockBlockRecord(PROJECT_A, 0, 0, 1),
          mockBlockRecord(PROJECT_B, 1, 0, 2),
          mockBlockRecord(PROJECT_A, 2, 0, 3),
          mockBlockRecord(PROJECT_B, 2, 1, 4),
        ])

        await repository.refresh()

        const result = await repository.getProjectsAggregatedDailyCount([
          PROJECT_A,
        ])
        expect(result).toEqual(
          [
            getDailyTransactionCountRecord(PROJECT_A, 0, 1),
            getDailyTransactionCountRecord(PROJECT_A, 2, 3),
          ].map((i) => omit(i, 'projectId')),
        )
      })

      it('should return correct response for multiple projects', async () => {
        await db.blockTransactionCount.upsertMany([
          // day 0
          mockBlockRecord(PROJECT_A, 0, 0, 1),
          mockBlockRecord(PROJECT_A, 0, 1, 1),
          // day 1
          mockBlockRecord(PROJECT_B, 1, 0, 2),
          mockBlockRecord(PROJECT_C, 1, 0, 3),
          // day 2
          mockBlockRecord(PROJECT_A, 2, 0, 3),
          mockBlockRecord(PROJECT_B, 2, 1, 4),
          // day 3
          mockBlockRecord(PROJECT_B, 3, 0, 2),
          mockBlockRecord(PROJECT_C, 3, 0, 3),
          // day 4
          mockBlockRecord(PROJECT_C, 4, 0, 4),
          // day 5
          mockBlockRecord(PROJECT_B, 5, 0, 2),
        ])

        await repository.refresh()

        const result = await repository.getProjectsAggregatedDailyCount([
          PROJECT_A,
          PROJECT_B,
        ])
        const day = (day: number) => new UnixTime(UnixTime.DAY * day)
        expect(result).toEqual([
          { timestamp: day(0), count: 2 },
          { timestamp: day(1), count: 2 },
          { timestamp: day(2), count: 7 },
          { timestamp: day(3), count: 2 },
          { timestamp: day(5), count: 2 },
        ])
      })
    },
  )
})

const mockBlockRecord = (
  projectId: ProjectId,
  day: number,
  offset: number,
  count = 1,
): BlockTransactionCountRecord => ({
  projectId,
  blockNumber: 100 * day + offset,
  count,
  timestamp: new UnixTime(UnixTime.DAY * day + offset),
})

const mockZkSyncRecord = (day: number, offset: number) => ({
  blockIndex: 1 + offset,
  blockNumber: day * 100 + offset,
  timestamp: new UnixTime(UnixTime.DAY * day + offset),
})

const mockStarkExRecord = (
  projectId: ProjectId,
  day: number,
  offset: number,
  count = 1,
) => ({
  projectId,
  count,
  timestamp: new UnixTime(UnixTime.DAY * day + offset),
})

const getDailyTransactionCountRecord = (
  projectId: ProjectId | string,
  day: number,
  count = 1,
): DailyTransactionCountRecord => ({
  projectId: ProjectId(projectId.toString()),
  timestamp: new UnixTime(UnixTime.DAY * day),
  count,
})
const projectIdCompare = (
  a: DailyTransactionCountRecord,
  b: DailyTransactionCountRecord,
) => a.projectId.toString().localeCompare(b.projectId.toString())

const groupByTimestampAndSortByProjectIdInside = (
  records: DailyTransactionCountRecord[],
) => {
  const grouped = groupBy(records, (record) => record.timestamp.toString())
  return mapValues(grouped, (items) => items.sort(projectIdCompare))
}
