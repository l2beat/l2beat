import { Logger } from '@l2beat/backend-tools'
import type {
  AggregatedLivenessRecord,
  Database,
  LivenessRecord,
} from '@l2beat/database'
import { createTrackedTxId, type TrackedTxConfigEntry } from '@l2beat/shared'
import {
  ProjectId,
  type SavedConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TrackedTxProject } from '../../../../../config/Config'
import type { IndexerService } from '../../../../../tools/uif/IndexerService'
import type { LivenessRecordWithConfig } from '../utils/mapToRecordWithConfig'
import { LivenessAggregatingIndexer } from './LivenessAggregatingIndexer'

const NOW = UnixTime.toStartOf(UnixTime.now(), 'hour')

const MOCK_CONFIGURATION_ID = createTrackedTxId.random()
const MOCK_CONFIGURATION_TYPE = 'batchSubmissions'

const MOCK_PROJECTS: TrackedTxProject[] = [
  {
    id: ProjectId('mocked-project'),
    isArchived: false,
    configurations: [
      mockObject<TrackedTxConfigEntry>({
        id: MOCK_CONFIGURATION_ID,
        type: 'liveness',
        subtype: MOCK_CONFIGURATION_TYPE,
        untilTimestamp: UnixTime.now(),
        projectId: ProjectId('mocked-project'),
      }),
    ],
  },
]

const MOCK_CONFIGURATIONS = [
  mockObject<Omit<SavedConfiguration<TrackedTxConfigEntry>, 'properties'>>({
    id: MOCK_CONFIGURATION_ID,
    maxHeight: null,
    currentHeight: 1,
  }),
]

const MOCK_LIVENESS: LivenessRecord[] = [
  mockObject<LivenessRecord>({
    configurationId: MOCK_CONFIGURATION_ID,
    timestamp: NOW - 1 * UnixTime.HOUR,
  }),
  mockObject<LivenessRecord>({
    configurationId: MOCK_CONFIGURATION_ID,
    timestamp: NOW - 3 * UnixTime.HOUR,
  }),
  mockObject<LivenessRecord>({
    configurationId: MOCK_CONFIGURATION_ID,
    timestamp: NOW - 7 * UnixTime.HOUR,
  }),
]

describe(LivenessAggregatingIndexer.name, () => {
  describe(LivenessAggregatingIndexer.prototype.update.name, () => {
    it('use correct time range when backfilling (whole day), on midnight', async () => {
      const indexer = createIndexer({ tag: 'update-backfill-midnight' })
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      // 00:00:00 someday
      const safeHeight = UnixTime.toStartOf(NOW, 'day') - 30 * UnixTime.DAY
      const parentSafeHeight = NOW

      const result = await indexer.update(safeHeight, parentSafeHeight)

      // 00:00:00 same day as safeHeight
      const expectedFrom = safeHeight
      // 00:00:00 next day as safeHeight
      const expectedTo = UnixTime.toNext(safeHeight, 'day')

      expect(mockGenerateLiveness).toHaveBeenCalledWith(
        expectedFrom,
        expectedTo,
      )
      expect(result).toEqual(expectedTo)
    })

    it('use correct time range when backfilling (whole day), on middle of the day', async () => {
      const indexer = createIndexer({ tag: 'update-backfill-middle-of-day' })
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      // 12:00:00 someday
      const safeHeight =
        UnixTime.toStartOf(NOW, 'day') - 30 * UnixTime.DAY + 12 * UnixTime.HOUR
      const parentSafeHeight = NOW

      const result = await indexer.update(safeHeight, parentSafeHeight)

      // same as safeHeight
      const expectedFrom = safeHeight
      // 00:00:00 next day as safeHeight
      const expectedTo = UnixTime.toNext(safeHeight, 'day')

      expect(mockGenerateLiveness).toHaveBeenCalledWith(
        expectedFrom,
        expectedTo,
      )
      expect(result).toEqual(expectedTo)
    })

    it('use correct time range when backfilling (few hours), on midnight', async () => {
      const indexer = createIndexer({
        tag: 'update-backfill-few-hours-midnight',
      })
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      // 00:00:00 of current day
      const safeHeight = UnixTime.toStartOf(NOW, 'day')
      // 05:00:00 of current day
      const parentSafeHeight = safeHeight + 5 * UnixTime.HOUR

      const result = await indexer.update(safeHeight, parentSafeHeight)

      const expectedFrom = safeHeight
      const expectedTo = parentSafeHeight

      expect(mockGenerateLiveness).toHaveBeenCalledWith(
        expectedFrom,
        expectedTo,
      )
      expect(result).toEqual(expectedTo)
    })

    it('use correct time range when fully synced (one hour), on middle of the day', async () => {
      const indexer = createIndexer({ tag: 'update-synced-middle-of-day' })
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      // round hour
      const parentSafeHeight = UnixTime.toStartOf(NOW, 'hour')
      // round hour - 1 hour as not yet synced
      const safeHeight = parentSafeHeight - 1 * UnixTime.HOUR

      const result = await indexer.update(safeHeight, parentSafeHeight)

      const expectedFrom = safeHeight
      const expectedTo = parentSafeHeight

      expect(mockGenerateLiveness).toHaveBeenCalledWith(
        expectedFrom,
        expectedTo,
      )
      expect(result).toEqual(expectedTo)
    })

    it('use correct time range when fully synced (one hour), on midnight', async () => {
      const indexer = createIndexer({ tag: 'update-synced-midnight' })
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      // 00:00:00 of current day
      const safeHeight = UnixTime.toStartOf(NOW, 'day')
      // 01:00:00 of current day
      const parentSafeHeight = safeHeight + 1 * UnixTime.HOUR

      const result = await indexer.update(safeHeight, parentSafeHeight)

      const expectedFrom = safeHeight
      const expectedTo = parentSafeHeight

      expect(mockGenerateLiveness).toHaveBeenCalledWith(
        expectedFrom,
        expectedTo,
      )
      expect(result).toEqual(expectedTo)
    })

    it('handles time range with min height', async () => {
      // 12:30:00 of some day
      const minHeight =
        UnixTime.toStartOf(NOW, 'day') -
        30 * UnixTime.DAY +
        12 * UnixTime.HOUR +
        30 * UnixTime.MINUTE
      const indexer = createIndexer({
        tag: 'update-min-height',
        minHeight,
      })
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      const parentSafeHeight = NOW

      const result = await indexer.update(
        minHeight - 1 * UnixTime.DAY,
        parentSafeHeight,
      )

      // 12:30:00 of some day - we do not round it to start of day
      const expectedFrom = minHeight
      // 00:00:00 of next day
      const expectedTo = UnixTime.toEndOf(minHeight, 'day')

      expect(mockGenerateLiveness).toHaveBeenCalledWith(
        expectedFrom,
        expectedTo,
      )
      expect(result).toEqual(expectedTo)
    })

    it('should save data to db', async () => {
      const mockAggregatedLivenessRepository = mockObject<
        Database['aggregatedLiveness']
      >({
        upsertMany: mockFn().resolvesTo(1),
      })
      const indexer = createIndexer({
        tag: 'update-save-to-db',
        aggregatedLivenessRepository: mockAggregatedLivenessRepository,
      })
      const mockAggregatedLiveness: AggregatedLivenessRecord[] = [
        mockObject<AggregatedLivenessRecord>({
          min: 10,
          avg: 20,
          max: 30,
          timestamp: NOW,
        }),
        mockObject<AggregatedLivenessRecord>({
          min: 20,
          avg: 30,
          max: 40,
          timestamp: NOW,
        }),
      ]
      indexer.generateLiveness = mockFn().resolvesTo(mockAggregatedLiveness)

      const parentSafeHeight = UnixTime.toStartOf(NOW, 'hour')
      const safeHeight = parentSafeHeight - 1 * UnixTime.HOUR

      const result = await indexer.update(safeHeight, parentSafeHeight)

      expect(mockAggregatedLivenessRepository.upsertMany).toHaveBeenCalledWith(
        mockAggregatedLiveness,
      )
      expect(result).toEqual(parentSafeHeight)
    })
  })

  describe(LivenessAggregatingIndexer.prototype.invalidate.name, () => {
    it('should return new safeHeight and not delete data', async () => {
      const livenessRepositoryMock = mockObject<Database['liveness']>({
        deleteAll: mockFn().resolvesTo(1),
      })

      const targetHeight = UnixTime.now()

      const indexer = createIndexer({
        tag: 'invalidate',
        livenessRepository: livenessRepositoryMock,
      })

      const result = await indexer.invalidate(targetHeight)

      expect(livenessRepositoryMock.deleteAll).not.toHaveBeenCalled()

      expect(result).toEqual(targetHeight)
    })
  })

  describe(LivenessAggregatingIndexer.prototype.generateLiveness.name, () => {
    it('should generate aggregated liveness', async () => {
      const mockLivenessRepository = mockObject<Database['liveness']>({
        getRecordsInRangeWithLatestBefore: mockFn().resolvesTo(MOCK_LIVENESS),
      })

      const mockIndexerService = mockObject<IndexerService>({
        getSavedConfigurations: mockFn().resolvesTo(MOCK_CONFIGURATIONS),
      })

      const indexer = createIndexer({
        tag: 'generate-liveness',
        livenessRepository: mockLivenessRepository,
        indexerService: mockIndexerService,
      })

      const result = await indexer.generateLiveness(
        NOW - 3 * UnixTime.HOUR,
        NOW,
      )

      expect(
        mockLivenessRepository.getRecordsInRangeWithLatestBefore,
      ).toHaveBeenCalledWith(
        [MOCK_CONFIGURATION_ID],
        NOW - 3 * UnixTime.HOUR,
        NOW,
      )

      expect(result).toEqual([
        {
          avg: 4 * UnixTime.HOUR,
          max: 4 * UnixTime.HOUR,
          min: 4 * UnixTime.HOUR,
          projectId: 'mocked-project',
          subtype: 'batchSubmissions',
          timestamp: NOW - 3 * UnixTime.HOUR,
          numberOfRecords: 1,
        },
        {
          avg: 2 * UnixTime.HOUR,
          max: 2 * UnixTime.HOUR,
          min: 2 * UnixTime.HOUR,
          projectId: 'mocked-project',
          subtype: 'batchSubmissions',
          timestamp: NOW - 1 * UnixTime.HOUR,
          numberOfRecords: 1,
        },
      ])
    })

    it('split time range to hours and get liveness data for each hour', async () => {
      const mockLivenessRepository = mockObject<Database['liveness']>({
        getRecordsInRangeWithLatestBefore: mockFn().resolvesTo(MOCK_LIVENESS),
      })

      const mockIndexerService = mockObject<IndexerService>({
        getSavedConfigurations: mockFn().resolvesTo(MOCK_CONFIGURATIONS),
      })

      const indexer = createIndexer({
        tag: 'generate-liveness-time-ranges',
        livenessRepository: mockLivenessRepository,
        indexerService: mockIndexerService,
      })

      const mockAggregateRecords = mockFn().returns(undefined)
      indexer.aggregateRecords = mockAggregateRecords

      await indexer.generateLiveness(NOW - 3 * UnixTime.HOUR, NOW)

      expect(
        mockLivenessRepository.getRecordsInRangeWithLatestBefore,
      ).toHaveBeenCalledWith(
        [MOCK_CONFIGURATION_ID],
        NOW - 3 * UnixTime.HOUR,
        NOW,
      )

      // time ranges after hourly split= [[3, 2], [2, 1], [1, 0]]
      expect(mockAggregateRecords).toHaveBeenCalledTimes(9)
      // first batchSubmissions call with from 3 to 2
      expect(mockAggregateRecords).toHaveBeenNthCalledWith(
        1,
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        MOCK_LIVENESS.map(mapRecord).filter(
          (r) => r.timestamp < NOW - 2 * UnixTime.HOUR,
        ),
        NOW - 3 * UnixTime.HOUR,
      )
      // second batchSubmissions call with from 2 to 1
      expect(mockAggregateRecords).toHaveBeenNthCalledWith(
        4,
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        MOCK_LIVENESS.map(mapRecord).filter(
          (r) => r.timestamp < NOW - 1 * UnixTime.HOUR,
        ),
        NOW - 2 * UnixTime.HOUR,
      )
      // second batchSubmissions call with from 1 to NOW
      expect(mockAggregateRecords).toHaveBeenNthCalledWith(
        7,
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        MOCK_LIVENESS.map(mapRecord).filter((r) => r.timestamp < NOW),
        NOW - 1 * UnixTime.HOUR,
      )
    })
  })

  describe(LivenessAggregatingIndexer.prototype.aggregateRecords.name, () => {
    it('should aggregate records', async () => {
      const indexer = createIndexer({ tag: 'aggregate-records' })

      const result = indexer.aggregateRecords(
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        MOCK_LIVENESS.map((record) => ({
          ...record,
          id: MOCK_CONFIGURATION_ID,
          subtype: MOCK_CONFIGURATION_TYPE,
        })),
        NOW - 7 * UnixTime.HOUR,
      )

      expect(result).toEqual({
        avg: ((4 + 2) / 2) * UnixTime.HOUR,
        max: 4 * UnixTime.HOUR,
        min: 2 * UnixTime.HOUR,
        projectId: 'mocked-project',
        subtype: 'batchSubmissions',
        timestamp: NOW - 7 * UnixTime.HOUR,
        numberOfRecords: 2,
      })
    })

    it('should use only latest before timestamp, and filter out all before', async () => {
      const indexer = createIndexer({ tag: 'aggregate-only-one-latest' })

      const start = UnixTime.toStartOf(NOW, 'day')

      const result = indexer.aggregateRecords(
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        [
          mockObject<LivenessRecordWithConfig>({
            configurationId: MOCK_CONFIGURATION_ID,
            timestamp: start + 5 * UnixTime.HOUR,
          }),
          mockObject<LivenessRecordWithConfig>({
            configurationId: MOCK_CONFIGURATION_ID,
            timestamp: start + 2 * UnixTime.HOUR,
          }),
          mockObject<LivenessRecordWithConfig>({
            configurationId: MOCK_CONFIGURATION_ID,
            timestamp: start,
          }),
          mockObject<LivenessRecordWithConfig>({
            configurationId: MOCK_CONFIGURATION_ID,
            timestamp: start - 1 * UnixTime.HOUR,
          }),
          mockObject<LivenessRecordWithConfig>({
            configurationId: MOCK_CONFIGURATION_ID,
            timestamp: start - 2 * UnixTime.HOUR,
          }),
        ],
        start,
      )

      expect(result).toEqual({
        avg: 2 * UnixTime.HOUR,
        max: 3 * UnixTime.HOUR,
        min: 1 * UnixTime.HOUR,
        projectId: 'mocked-project',
        subtype: 'batchSubmissions',
        timestamp: start,
        numberOfRecords: 3,
      })
    })

    it('should still calculate if no records before start', async () => {
      const indexer = createIndexer({ tag: 'aggregate-if-no-records-before' })

      const start = UnixTime.toStartOf(NOW, 'day')

      const result = indexer.aggregateRecords(
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        [
          mockObject<LivenessRecordWithConfig>({
            configurationId: MOCK_CONFIGURATION_ID,
            timestamp: start + 5 * UnixTime.HOUR,
          }),
          mockObject<LivenessRecordWithConfig>({
            configurationId: MOCK_CONFIGURATION_ID,
            timestamp: start + 2 * UnixTime.HOUR,
          }),
          mockObject<LivenessRecordWithConfig>({
            configurationId: MOCK_CONFIGURATION_ID,
            timestamp: start,
          }),
        ],
        start,
      )

      expect(result).toEqual({
        avg: 2.5 * UnixTime.HOUR,
        max: 3 * UnixTime.HOUR,
        min: 2 * UnixTime.HOUR,
        projectId: 'mocked-project',
        subtype: 'batchSubmissions',
        timestamp: start,
        numberOfRecords: 2,
      })
    })

    it('should skip if no data to calculate intervals', async () => {
      const indexer = createIndexer({ tag: 'skip-if-no-data' })

      const result = indexer.aggregateRecords(
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        MOCK_LIVENESS.slice(0, 1).map((record) => ({
          ...record,
          id: MOCK_CONFIGURATION_ID,
          subtype: MOCK_CONFIGURATION_TYPE,
        })),
        NOW,
      )

      expect(result).toEqual(undefined)
    })
  })
})

function mapRecord(record: LivenessRecord) {
  return {
    id: MOCK_CONFIGURATION_ID,
    configurationId: MOCK_CONFIGURATION_ID,
    subtype: MOCK_CONFIGURATION_TYPE,
    type: 'liveness',
    timestamp: record.timestamp,
    untilTimestamp: MOCK_PROJECTS[0].configurations[0].untilTimestamp,
    projectId: MOCK_PROJECTS[0].id,
  }
}

function createIndexer(options: {
  tag: string
  livenessRepository?: Database['liveness']
  aggregatedLivenessRepository?: Database['aggregatedLiveness']
  indexerService?: IndexerService
  minHeight?: number
}) {
  return new LivenessAggregatingIndexer({
    tags: { tag: options.tag },
    indexerService: options.indexerService ?? mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: options.minHeight ?? 0,
    parents: [],
    db: mockObject<Database>({
      liveness:
        options.livenessRepository ?? mockObject<Database['liveness']>(),
      aggregatedLiveness:
        options.aggregatedLivenessRepository ??
        mockObject<Database['aggregatedLiveness']>({
          upsertMany: mockFn().resolvesTo(1),
        }),
    }),
    projects: MOCK_PROJECTS,
  })
}
