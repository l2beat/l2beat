import { Logger } from '@l2beat/backend-tools'
import type { Database, HourlyActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import type { IndexerService } from '../../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../../tools/uif/ids'
import { BlockActivityIndexer } from './BlockActivityIndexer'
import type { ActivityBlockSource, BlockActivityIndexerDeps } from './types'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(BlockActivityIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  describe(BlockActivityIndexer.prototype.update.name, () => {
    it('make update based on batchSize', async () => {
      const blockSource = mockBlockSource([block(START, 1, 1, 50)])

      const indexer = createIndexer({
        blockSource,
        batchSize: 50,
      })

      const newSafeHeight = await indexer.update(0, 100)

      expect(blockSource.getBlocks).toHaveBeenCalledWith(0, 50)
      expect(newSafeHeight).toEqual(50)
    })

    it('adds the days of the batch and updates sync metadata', async () => {
      const activityRepository = mockObject<Database['activity']>({
        addMany: mockFn().resolvesTo(3),
      })
      const syncMetadataRepository = mockObject<Database['syncMetadata']>({
        updateSyncedUntil: mockFn().resolvesTo(undefined),
      })
      const indexer = createIndexer({
        blockSource: mockBlockSource([
          block(START, 5, 5, 9),
          block(START, 0, 0, 10),
          block(START + 1 * UnixTime.DAY, 4, 5, 13),
          block(START + 2 * UnixTime.DAY, 2, 2, 16),
        ]),
        db: mockDatabaseWith({
          activity: activityRepository,
          syncMetadata: syncMetadataRepository,
        }),
        batchSize: 100,
      })

      const newSafeHeight = await indexer.update(9, 16)

      expect(activityRepository.addMany).toHaveBeenOnlyCalledWith([
        activityRecord('a', START, 5, 5, 9, 10),
        activityRecord('a', START + 1 * UnixTime.DAY, 4, 5, 13, 13),
        activityRecord('a', START + 2 * UnixTime.DAY, 2, 2, 16, 16),
      ])
      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenCalledWith(
        'activity',
        ['a'],
        START + 2 * UnixTime.DAY,
        16,
      )
      expect(newSafeHeight).toEqual(16)
    })

    it('continues the peak of a minute split between consecutive batches', async () => {
      const hourlyActivityRepository = mockHourlyActivityRepository()
      const indexer = createIndexer({
        blockSource: mockBlockSourceOnce(
          [block(START + 50, 3, 3, 1), block(START + 55, 2, 2, 2)],
          [block(START + 58, 4, 4, 3), block(START + 70, 1, 1, 4)],
        ),
        db: mockDatabaseWith({ hourlyActivity: hourlyActivityRepository }),
        batchSize: 1,
      })

      await indexer.update(1, 2)
      await indexer.update(3, 4)

      expect(hourlyActivityRepository.addMany).toHaveBeenNthCalledWith(2, [
        hourlyRecord(START, { count: 5, peakCount: 9 }),
      ])
    })

    it('continues a minute once when a batch is retried after its save failed', async () => {
      const hourlyActivityRepository = mockHourlyActivityRepository()
      hourlyActivityRepository.addMany
        .resolvesToOnce(1)
        .rejectsWithOnce(new Error('Connection lost'))
      const secondBatch = [
        block(START + 58, 4, 4, 3),
        block(START + 70, 1, 1, 4),
      ]
      const indexer = createIndexer({
        blockSource: mockBlockSourceOnce(
          [block(START + 50, 3, 3, 1), block(START + 55, 2, 2, 2)],
          secondBatch,
          secondBatch,
        ),
        db: mockDatabaseWith({ hourlyActivity: hourlyActivityRepository }),
        batchSize: 1,
      })

      await indexer.update(1, 2)
      await expect(indexer.update(3, 4)).toBeRejected()
      await indexer.update(3, 4)

      expect(hourlyActivityRepository.addMany).toHaveBeenNthCalledWith(3, [
        hourlyRecord(START, { count: 5, peakCount: 9 }),
      ])
    })

    it('does not continue a minute from a batch that did not end right before', async () => {
      const hourlyActivityRepository = mockHourlyActivityRepository()
      const indexer = createIndexer({
        blockSource: mockBlockSourceOnce(
          [block(START + 50, 3, 3, 1), block(START + 55, 2, 2, 2)],
          [block(START + 58, 4, 4, 5)],
        ),
        db: mockDatabaseWith({ hourlyActivity: hourlyActivityRepository }),
        batchSize: 1,
      })

      await indexer.update(1, 2)
      await indexer.update(5, 5)

      expect(hourlyActivityRepository.addMany).toHaveBeenNthCalledWith(2, [
        hourlyRecord(START, { count: 4, peakCount: 4 }),
      ])
    })
  })

  describe(BlockActivityIndexer.prototype.invalidate.name, () => {
    it('returns targetHeight if no rows found', async () => {
      const activityRepository = mockObject<Database['activity']>({
        getByProjectIncludingDataPoint: mockFn().resolvesTo([]),
      })

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

      const activityRepository = mockObject<Database['activity']>({
        getByProjectIncludingDataPoint:
          mockFn().resolvesTo(mockActivityRecords),
      })

      const indexer = createIndexer({
        db: mockDatabase({ activity: activityRepository }),
      })

      const targetHeight = 15
      expect(
        async () => await indexer.invalidate(targetHeight),
      ).toBeRejectedWith(
        `There should be exactly one record that includes data point (projectId: ${mockProjectId}, dataPoint: ${targetHeight})`,
      )
    })

    it('deletes the hours from the start of the invalidated day', async () => {
      const activityRepository = mockObject<Database['activity']>({
        getByProjectIncludingDataPoint: mockFn().resolvesTo([
          activityRecord('a', START, 2, 2, 11, 20),
        ]),
        deleteByProjectIdFrom: mockFn().resolvesTo(1),
      })
      const hourlyActivityRepository = mockHourlyActivityRepository()
      const indexer = createIndexer({
        db: mockDatabaseWith({
          activity: activityRepository,
          hourlyActivity: hourlyActivityRepository,
        }),
      })

      await indexer.invalidate(15)

      expect(
        hourlyActivityRepository.deleteByProjectIdFrom,
      ).toHaveBeenOnlyCalledWith(ProjectId('a'), START)
    })

    it('deletes records and returns adjusted targetHeight', async () => {
      const mockProjectId = ProjectId('a')
      const mockActivityRecords = [
        activityRecord(mockProjectId, START - 1 * UnixTime.DAY, 2, 11, 20),
      ]

      const activityRepository = mockObject<Database['activity']>({
        getByProjectIncludingDataPoint:
          mockFn().resolvesTo(mockActivityRecords),
        deleteByProjectIdFrom: mockFn().resolvesTo(undefined),
      })

      const indexer = createIndexer({
        db: mockDatabaseWith({ activity: activityRepository }),
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

function block(
  timestamp: UnixTime,
  txsCount: number,
  uopsCount: number | null,
  number: number,
) {
  return { timestamp, txsCount, uopsCount, number }
}

/** Uops follow txs, so that only the values a test is about need setting */
function hourlyRecord(
  timestamp: UnixTime,
  { count, peakCount }: { count: number; peakCount: number },
): HourlyActivityRecord {
  return {
    projectId: ProjectId('a'),
    timestamp,
    count,
    uopsCount: count,
    peakCount,
    peakUopsCount: peakCount,
  }
}

function mockBlockSource(blocks: ReturnType<typeof block>[]) {
  return mockObject<ActivityBlockSource>({
    getBlocks: mockFn().resolvesTo(blocks),
  })
}

/** One batch per call */
function mockBlockSourceOnce(...batches: ReturnType<typeof block>[][]) {
  const getBlocks = mockFn<ActivityBlockSource['getBlocks']>()
  for (const batch of batches) {
    getBlocks.resolvesToOnce(batch)
  }
  return mockObject<ActivityBlockSource>({ getBlocks })
}

function mockHourlyActivityRepository() {
  return mockObject<Database['hourlyActivity']>({
    addMany: mockFn().resolvesTo(1),
    deleteByProjectIdFrom: mockFn().resolvesTo(0),
  })
}

function mockDatabaseWith(overrides: Partial<Database>) {
  return mockDatabase({
    activity: mockObject<Database['activity']>({
      addMany: mockFn().resolvesTo(1),
    }),
    hourlyActivity: mockHourlyActivityRepository(),
    syncMetadata: mockObject<Database['syncMetadata']>({
      updateSyncedUntil: mockFn().resolvesTo(undefined),
    }),
    ...overrides,
  })
}

function createIndexer(
  deps?: Partial<BlockActivityIndexerDeps>,
): BlockActivityIndexer {
  return new BlockActivityIndexer(
    {
      parents: [],
      blockSource: mockBlockSource([]),
      db: mockDatabaseWith({}),
      projectId: ProjectId('a'),
      indexerService: mockObject<IndexerService>({}),
      minHeight: 0,
      batchSize: 1,
      ...deps,
    },
    Logger.SILENT,
  )
}
