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

    it('adds the hours, then the days with the peaks of the hours as stored', async () => {
      const hourlyActivityRepository = mockHourlyActivityRepository()
      hourlyActivityRepository.addMany.resolvesToOnce([
        hourlyRecord(START, 20),
        hourlyRecord(START + 1 * UnixTime.DAY, 2),
      ])
      const activityRepository = mockObject<Database['activity']>({
        addMany: mockFn().resolvesTo(2),
      })
      const syncMetadataRepository = mockObject<Database['syncMetadata']>({
        updateSyncedUntil: mockFn().resolvesTo(undefined),
      })
      const indexer = createIndexer({
        blockSource: mockBlockSource([
          block(START + 10, 3, 3, 1),
          block(START + 70, 4, 4, 2),
          block(START + 1 * UnixTime.DAY, 2, 2, 3),
        ]),
        db: mockDatabaseWith({
          activity: activityRepository,
          hourlyActivity: hourlyActivityRepository,
          syncMetadata: syncMetadataRepository,
        }),
        batchSize: 100,
      })

      const newSafeHeight = await indexer.update(1, 3)

      expect(hourlyActivityRepository.addMany).toHaveBeenOnlyCalledWith([
        hourlyRecord(START, 7),
        hourlyRecord(START + 1 * UnixTime.DAY, 2),
      ])
      expect(activityRepository.addMany).toHaveBeenOnlyCalledWith([
        dayRecord(START, {
          count: 7,
          start: 1,
          end: 2,
          peakHour: 20,
          peakMinute: 4,
        }),
        dayRecord(START + 1 * UnixTime.DAY, {
          count: 2,
          start: 3,
          end: 3,
          peakHour: 2,
          peakMinute: 2,
        }),
      ])
      expect(syncMetadataRepository.updateSyncedUntil).toHaveBeenCalledWith(
        'activity',
        ['a'],
        START + 1 * UnixTime.DAY,
        3,
      )
      expect(newSafeHeight).toEqual(3)
    })

    it('keeps two weeks of hours back from the newest block', async () => {
      const hourlyActivityRepository = mockHourlyActivityRepository()
      const indexer = createIndexer({
        blockSource: mockBlockSource([
          block(START + 30 * UnixTime.DAY + 90, 1, 1, 1),
        ]),
        db: mockDatabaseWith({ hourlyActivity: hourlyActivityRepository }),
      })

      await indexer.update(1, 1)

      expect(
        hourlyActivityRepository.deleteByProjectIdUntil,
      ).toHaveBeenOnlyCalledWith(ProjectId('a'), START + 16 * UnixTime.DAY)
    })

    it('continues the peak of a minute split between consecutive batches', async () => {
      const activityRepository = mockActivityRepository()
      const indexer = createIndexer({
        blockSource: mockBlockSourceOnce(
          [block(START + 50, 3, 3, 1), block(START + 55, 2, 2, 2)],
          [block(START + 58, 4, 4, 3), block(START + 70, 1, 1, 4)],
        ),
        db: mockDatabaseWith({ activity: activityRepository }),
        batchSize: 1,
      })

      await indexer.update(1, 2)
      await indexer.update(3, 4)

      expect(peakMinuteOf(activityRepository, 2)).toEqual(9)
    })

    it('continues a minute once when a batch is retried after its save failed', async () => {
      const activityRepository = mockActivityRepository()
      activityRepository.addMany
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
        db: mockDatabaseWith({ activity: activityRepository }),
        batchSize: 1,
      })

      await indexer.update(1, 2)
      await expect(indexer.update(3, 4)).toBeRejected()
      await indexer.update(3, 4)

      expect(peakMinuteOf(activityRepository, 3)).toEqual(9)
    })

    it('does not continue a minute from a batch that did not end right before', async () => {
      const activityRepository = mockActivityRepository()
      const indexer = createIndexer({
        blockSource: mockBlockSourceOnce(
          [block(START + 50, 3, 3, 1), block(START + 55, 2, 2, 2)],
          [block(START + 58, 4, 4, 5)],
        ),
        db: mockDatabaseWith({ activity: activityRepository }),
        batchSize: 1,
      })

      await indexer.update(1, 2)
      await indexer.update(5, 5)

      expect(peakMinuteOf(activityRepository, 2)).toEqual(4)
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
  count: number,
): HourlyActivityRecord {
  return { projectId: ProjectId('a'), timestamp, count, uopsCount: count }
}

/** Uops follow txs */
function dayRecord(
  timestamp: UnixTime,
  values: {
    count: number
    start: number
    end: number
    peakHour: number
    peakMinute: number
  },
) {
  return {
    ...activityRecord(
      'a',
      timestamp,
      values.count,
      values.count,
      values.start,
      values.end,
    ),
    peakHourCount: values.peakHour,
    peakHourUopsCount: values.peakHour,
    peakMinuteCount: values.peakMinute,
    peakMinuteUopsCount: values.peakMinute,
  }
}

/** The peak minute of the only day in the `nth` call */
function peakMinuteOf(
  activityRepository: ReturnType<typeof mockActivityRepository>,
  nth: number,
) {
  return activityRepository.addMany.calls[nth - 1]?.args[0][0]?.peakMinuteCount
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

function mockActivityRepository() {
  return mockObject<Database['activity']>({
    addMany: mockFn().resolvesTo(1),
  })
}

/** Stores nothing before, so the totals are the hours as added */
function mockHourlyActivityRepository() {
  return mockObject<Database['hourlyActivity']>({
    addMany: mockFn(async (records: HourlyActivityRecord[]) => records),
    deleteByProjectIdUntil: mockFn().resolvesTo(0),
    deleteByProjectIdFrom: mockFn().resolvesTo(0),
  })
}

function mockDatabaseWith(overrides: Partial<Database>) {
  return mockDatabase({
    activity: mockActivityRepository(),
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
