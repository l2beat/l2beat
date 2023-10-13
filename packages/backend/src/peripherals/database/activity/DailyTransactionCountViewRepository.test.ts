import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { groupBy, mapValues, omit } from 'lodash'

import { setupDatabaseTestSuite } from '../../../test/database'
import {
  BlockTransactionCountRecord,
  BlockTransactionCountRepository,
} from './BlockTransactionCountRepository'
import {
  DailyTransactionCountRecord,
  DailyTransactionCountViewRepository,
} from './DailyTransactionCountViewRepository'
import { StarkexTransactionCountRepository } from './StarkexCountRepository'
import { ZksyncTransactionRepository } from './ZksyncTransactionRepository'

const PROJECT_A = ProjectId('project-a')
const PROJECT_B = ProjectId('project-b')
const PROJECT_C = ProjectId('project-c')

describe(DailyTransactionCountViewRepository.name, () => {
  const { database } = setupDatabaseTestSuite()
  const repository = new DailyTransactionCountViewRepository(
    database,
    Logger.SILENT,
  )
  const blockRepository = new BlockTransactionCountRepository(
    database,
    Logger.SILENT,
  )
  const zkSyncRepository = new ZksyncTransactionRepository(
    database,
    Logger.SILENT,
  )
  const starkExRepository = new StarkexTransactionCountRepository(
    database,
    Logger.SILENT,
  )

  beforeEach(async () => {
    // Delete all rows from all tables that are used in the view
    await blockRepository.deleteAll()
    await zkSyncRepository.deleteAll()
    await starkExRepository.deleteAll()

    await repository.refresh()
  })

  describe(
    DailyTransactionCountViewRepository.prototype.getDailyCounts.name,
    () => {
      it('view must be empty', async () => {
        const result = await repository.getDailyCounts()
        expect(result).toEqual([])
      })

      it('should return correct response for single project', async () => {
        await blockRepository.addOrUpdate(mockBlockRecord(PROJECT_A, 0, 0, 1))
        await blockRepository.addOrUpdate(mockBlockRecord(PROJECT_A, 1, 0, 2))
        await blockRepository.addOrUpdate(mockBlockRecord(PROJECT_A, 2, 0, 3))
        await blockRepository.addOrUpdate(mockBlockRecord(PROJECT_A, 2, 1, 4))

        await repository.refresh()

        const result = await repository.getDailyCounts()
        expect(result).toEqual(
          [
            [0, 1],
            [1, 2],
            [2, 7],
          ].map(([day, count]) =>
            getDailyTransactionCountRecord(PROJECT_A, day, count),
          ),
        )
      })

      it('should return correct response for multiple projects', async () => {
        const blockMockRecords = [
          mockBlockRecord(PROJECT_A, 0, 0, 1),
          mockBlockRecord(PROJECT_A, 1, 0, 2),
          mockBlockRecord(PROJECT_B, 1, 0, 3),
          mockBlockRecord(PROJECT_A, 2, 0, 4),
          mockBlockRecord(PROJECT_A, 2, 1, 5),
        ]
        await Promise.all(
          blockMockRecords.map((record) => blockRepository.addOrUpdate(record)),
        )

        const zkSyncMockRecords = [
          mockZkSyncRecord(1, 0),
          mockZkSyncRecord(1, 1),
          mockZkSyncRecord(2, 0),
          mockZkSyncRecord(2, 1),
          mockZkSyncRecord(2, 2),
        ]
        await Promise.all(
          zkSyncMockRecords.map((record) =>
            zkSyncRepository.addOrUpdate(record),
          ),
        )

        const starkExMockRecords = [
          mockStarkExRecord(PROJECT_C, 1, 0, 1),
          mockStarkExRecord(PROJECT_C, 1, 1, 2),
          mockStarkExRecord(PROJECT_C, 2, 0, 3),
          mockStarkExRecord(PROJECT_C, 3, 0, 4),
        ]
        await starkExRepository.addOrUpdateMany(starkExMockRecords)

        const blockRelatedValues: DailyTransactionCountRecord[] = [
          [PROJECT_A, 0, 1],
          [PROJECT_A, 1, 2],
          [PROJECT_B, 1, 3],
          [PROJECT_A, 2, 9],
        ].map(([projectId, day, count]) =>
          getDailyTransactionCountRecord(
            projectId as unknown as string,
            day as number,
            count as number,
          ),
        )

        await repository.refresh()

        const zkSyncRelatedValues: DailyTransactionCountRecord[] = [
          ['zksync', 1, 2],
          ['zksync', 2, 3],
        ].map(([projectId, day, count]) =>
          getDailyTransactionCountRecord(
            projectId as unknown as string,
            day as number,
            count as number,
          ),
        )

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
    },
  )

  describe(
    DailyTransactionCountViewRepository.prototype
      .getProjectsAggregatedDailyCount.name,
    () => {
      it('should return correct response for single project', async () => {
        await blockRepository.addOrUpdate(mockBlockRecord(PROJECT_A, 0, 0, 1))
        await blockRepository.addOrUpdate(mockBlockRecord(PROJECT_B, 1, 0, 2))
        await blockRepository.addOrUpdate(mockBlockRecord(PROJECT_A, 2, 0, 3))
        await blockRepository.addOrUpdate(mockBlockRecord(PROJECT_B, 2, 1, 4))

        await repository.refresh()

        const result = await repository.getProjectsAggregatedDailyCount([
          PROJECT_A,
        ])
        expect(result).toEqual(
          [
            [0, 1],
            [2, 3],
          ]
            .map(([day, count]) =>
              getDailyTransactionCountRecord(PROJECT_A, day, count),
            )
            .map((i) => omit(i, 'projectId')),
        )
      })

      it('should return correct response for multiple projects', async () => {
        const mockRecords = [
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
        ]
        await Promise.all(
          mockRecords.map((record) => blockRepository.addOrUpdate(record)),
        )

        await repository.refresh()

        const result = await repository.getProjectsAggregatedDailyCount([
          PROJECT_A,
          PROJECT_B,
        ])
        expect(result).toEqual(
          [
            [0, 2],
            [1, 2],
            [2, 7],
            [3, 2],
            [5, 2],
          ].map(([day, count]) => ({
            timestamp: new UnixTime(UnixTime.DAY * day),
            count,
          })),
        )
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
