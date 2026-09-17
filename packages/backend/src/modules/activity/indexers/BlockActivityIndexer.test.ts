import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { BlockActivityIndexer } from './BlockActivityIndexer'
import type { ActivityIndexerDeps, TxsCountService } from './types'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(BlockActivityIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockActivityIndexer.prototype.update.name, () => {
    it('make update based on batchSize', async () => {
      const txsCountService = {
        getTxsCount: vi.fn().mockResolvedValue({
          records: [],
        }),
      } as unknown as TxsCountService

      const indexer = createIndexer({
        txsCountService,
        batchSize: 50,
      })

      const newSafeHeight = await indexer.update(0, 100)

      expect(txsCountService.getTxsCount).toHaveBeenCalledWith(0, 50)
      expect(newSafeHeight).toBe(50)
    })

    it('gets blocks counts, sum with current counts, saves to db and updates sync metadata', async () => {
      const activityRepository = {
        getByProjectAndTimeRange: vi
          .fn()
          .mockResolvedValue([
            activityRecord('a', START, 7, 7, 0, 8),
            activityRecord('a', START + 1 * UnixTime.DAY, 3, 4, 11, 13),
          ]),
        upsertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['activity']

      const syncMetadataRepository = {
        updateSyncedUntil: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['syncMetadata']

      const txsCountService = {
        getTxsCount: vi.fn().mockResolvedValue({
          records: [
            activityRecord('a', START, 5, 5, 9, 10),
            activityRecord('a', START + 1 * UnixTime.DAY, 4, 5, 13, 15),
            activityRecord('a', START + 2 * UnixTime.DAY, 2, 2, 16, 20),
          ],
          latestTimestamp: START + 2 * UnixTime.DAY,
        }),
      } as unknown as TxsCountService

      const indexer = createIndexer({
        txsCountService,
        db: mockDatabase({
          activity: activityRepository,
          syncMetadata: syncMetadataRepository,
        }),
        batchSize: 100,
      })

      const newSafeHeight = await indexer.update(0, 10)

      expect(txsCountService.getTxsCount).toHaveBeenCalledWith(0, 10)
      expect(activityRepository.upsertMany).toHaveBeenCalledWith([
        activityRecord('a', START, 12, 12, 0, 10),
        activityRecord('a', START + 1 * UnixTime.DAY, 7, 9, 11, 15),
        activityRecord('a', START + 2 * UnixTime.DAY, 2, 2, 16, 20),
      ])
      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenCalledWith(
        'activity',
        ['a'],
        START + 2 * UnixTime.DAY,
        10,
      )
      expect(newSafeHeight).toBe(10)
    })

    it('handle cases with block with 0 txs', async () => {
      const activityRepository = {
        getByProjectAndTimeRange: vi
          .fn()
          .mockResolvedValue([activityRecord('a', START, 7, 10, 0, 8)]),
        upsertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['activity']

      const syncMetadataRepository = {
        updateSyncedUntil: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['syncMetadata']

      const txsCountService = {
        getTxsCount: vi.fn().mockResolvedValue({
          records: [activityRecord('a', START, 0, 0, 9, 10)],
          latestTimestamp: START,
        }),
      } as unknown as TxsCountService

      const indexer = createIndexer({
        txsCountService,
        db: mockDatabase({
          activity: activityRepository,
          syncMetadata: syncMetadataRepository,
        }),
        batchSize: 100,
      })

      const newSafeHeight = await indexer.update(0, 10)

      expect(txsCountService.getTxsCount).toHaveBeenCalledWith(0, 10)
      expect(activityRepository.upsertMany).toHaveBeenCalledWith([
        {
          projectId: ProjectId('a'),
          timestamp: START,
          count: 7,
          uopsCount: 10,
          start: 0,
          end: 10,
        },
      ])
      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenCalledWith(
        'activity',
        ['a'],
        START,
        10,
      )
      expect(newSafeHeight).toBe(10)
    })
  })

  describe(BlockActivityIndexer.prototype.getDatabaseEntries.name, () => {
    it('return an empty map if there are no records', async () => {
      const indexer = createIndexer()

      const entries = await indexer.getDatabaseEntries([])

      expect(entries).toEqual(new Map())
    })

    it('returns a map of timestamps to records', async () => {
      const mockActivityRecords = [
        activityRecord('a', START, 1, 1),
        activityRecord('a', START + 1 * UnixTime.DAY, 2, 2),
        activityRecord('a', START + 2 * UnixTime.DAY, 4, 6),
      ]

      const activityRepository = {
        getByProjectAndTimeRange: vi
          .fn()
          .mockResolvedValue(mockActivityRecords),
      } as unknown as Database['activity']

      const indexer = createIndexer({
        db: mockDatabase({ activity: activityRepository }),
        batchSize: 100,
      })

      const entries = await indexer.getDatabaseEntries([
        activityRecord('a', START + 2 * UnixTime.DAY, 4, 6),
        activityRecord('a', START + 1 * UnixTime.HOUR, 4, 4),
        activityRecord('a', START, 1, 1),
      ])

      // finds min and max timestamp
      expect(
        activityRepository.getByProjectAndTimeRange,
      ).toHaveBeenNthCalledWith(1, ProjectId('a'), [
        START,
        START + 2 * UnixTime.DAY,
      ])

      // returns a map of timestamps to counts
      expect(entries).toEqual(
        new Map([
          [START, mockActivityRecords[0]],
          [START + 1 * UnixTime.DAY, mockActivityRecords[1]],
          [START + 2 * UnixTime.DAY, mockActivityRecords[2]],
        ]),
      )
    })
  })

  describe(BlockActivityIndexer.prototype.invalidate.name, () => {
    it('returns targetHeight if no rows found', async () => {
      const activityRepository = {
        getByProjectIncludingDataPoint: vi.fn().mockResolvedValue([]),
      } as unknown as Database['activity']

      const indexer = createIndexer({
        db: mockDatabase({ activity: activityRepository }),
      })

      const targetHeight = 10
      const newSafeHeight = await indexer.invalidate(targetHeight)

      expect(newSafeHeight).toEqual(targetHeight)
    })

    it('throws assertion when more than one record found', async () => {
      const mockProjectId = ProjectId('a')
      const mockActivityRecords = [
        activityRecord(mockProjectId, START - 1 * UnixTime.DAY, 2, 11, 20),
        activityRecord(mockProjectId, START - 2 * UnixTime.DAY, 4, 11, 20),
      ]

      const activityRepository = {
        getByProjectIncludingDataPoint: vi
          .fn()
          .mockResolvedValue(mockActivityRecords),
      } as unknown as Database['activity']

      const indexer = createIndexer({
        db: mockDatabase({ activity: activityRepository }),
      })

      const targetHeight = 15
      await expect(
        async () => await indexer.invalidate(targetHeight),
      ).rejects.toThrow(
        `There should be exactly one record that includes data point (projectId: ${mockProjectId}, dataPoint: ${targetHeight})`,
      )
    })

    it('deletes records and returns adjusted targetHeight', async () => {
      const mockProjectId = ProjectId('a')
      const mockActivityRecords = [
        activityRecord(mockProjectId, START - 1 * UnixTime.DAY, 2, 11, 20),
      ]

      const activityRepository = {
        getByProjectIncludingDataPoint: vi
          .fn()
          .mockResolvedValue(mockActivityRecords),
        deleteByProjectIdFrom: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['activity']

      const indexer = createIndexer({
        db: mockDatabase({ activity: activityRepository }),
      })

      const targetHeight = 15
      const result = await indexer.invalidate(targetHeight)

      expect(
        activityRepository.getByProjectIncludingDataPoint,
      ).toHaveBeenCalledWith(mockProjectId, targetHeight + 1)

      const expectedTargetHeight = mockActivityRecords[0].start - 1
      const expectedTimestamp = mockActivityRecords[0].timestamp

      expect(activityRepository.deleteByProjectIdFrom).toHaveBeenCalledWith(
        mockProjectId,
        expectedTimestamp,
      )

      expect(result).toEqual(expectedTargetHeight)
    })
  })
})

function activityRecord(
  projectId: string,
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
  start = 0,
  end = 0,
) {
  return {
    projectId: ProjectId(projectId),
    timestamp,
    count,
    uopsCount,
    start,
    end,
  }
}

function createIndexer(
  deps?: Partial<ActivityIndexerDeps>,
): BlockActivityIndexer {
  return new BlockActivityIndexer(
    {
      parents: [],
      txsCountService: {
        getTxsCount: vi.fn().mockResolvedValue([]),
      } as unknown as TxsCountService,
      db: mockDatabase({
        activity: {
          getByProjectAndTimeRange: vi.fn().mockResolvedValue([]),
          upsertMany: vi.fn().mockResolvedValue(undefined),
        } as unknown as Database['activity'],
        syncMetadata: {
          updateSyncedUntil: vi.fn().mockResolvedValue(undefined),
        } as unknown as Database['syncMetadata'],
      }),
      projectId: ProjectId('a'),
      indexerService: {} as unknown as IndexerService,
      minHeight: 0,
      batchSize: 1,
      ...deps,
    },
    Logger.SILENT,
  )
}
