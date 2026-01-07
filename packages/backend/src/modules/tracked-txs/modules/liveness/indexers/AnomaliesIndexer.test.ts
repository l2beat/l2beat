import { Logger } from '@l2beat/backend-tools'
import type {
  AnomalyRecord,
  AnomalyStatsRecord,
  Database,
  LivenessRecord,
} from '@l2beat/database'
import { createTrackedTxId, type TrackedTxConfigEntry } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TrackedTxProject } from '../../../../../config/Config'
import type { IndexerService } from '../../../../../tools/uif/IndexerService'
import type { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import type { LivenessRecordWithConfig } from '../utils/mapToRecordWithConfig'
import { AnomaliesIndexer } from './AnomaliesIndexer'

const NOW = UnixTime.now()
const MIN = NOW - 100 * UnixTime.DAY

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

describe(AnomaliesIndexer.name, () => {
  describe(AnomaliesIndexer.prototype.update.name, () => {
    it('should skip update', async () => {
      const indexer = createIndexer({
        tag: 'update-skip',
      })

      const mockCalculateAnomalies = mockFn().resolvesTo([])
      indexer.getAnomalies = mockCalculateAnomalies

      const from = MIN
      const to = NOW - 2 * UnixTime.DAY

      const result = await indexer.update(from, to)

      expect(mockCalculateAnomalies).not.toHaveBeenCalled()

      expect(result).toEqual(to)
    })

    it('should update', async () => {
      const mockAnomaliesRepository = mockObject<Database['anomalies']>({
        deleteAll: mockFn().resolvesTo(0),
        upsertMany: mockFn().resolvesTo(1),
      })

      const mockAnomalyStatsRepository = mockObject<Database['anomalyStats']>({
        upsertMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        tag: 'update',
        anomaliesRepository: mockAnomaliesRepository,
        anomalyStatsRepository: mockAnomalyStatsRepository,
      })

      const mockAnomalies: AnomalyRecord[] = [
        {
          timestamp: NOW - 1 * UnixTime.DAY,
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'batchSubmissions',
          duration: 100,
        },
      ]

      const mockAnomalyStats: AnomalyStatsRecord[] = [
        {
          timestamp: NOW - 1 * UnixTime.DAY,
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'batchSubmissions',
          mean: 100,
          stdDev: 50,
        },
      ]

      const mockCalculateAnomalies = mockFn().resolvesTo({
        anomalyRecords: mockAnomalies,
        anomalyStatsRecords: mockAnomalyStats,
      })
      indexer.getAnomalies = mockCalculateAnomalies

      const from = NOW - 1 * UnixTime.DAY - 1 * UnixTime.HOUR
      const to = NOW

      const result = await indexer.update(from, to)

      expect(mockCalculateAnomalies).toHaveBeenCalledWith(
        UnixTime.toStartOf(NOW, 'day'),
      )

      expect(mockAnomaliesRepository.deleteAll).toHaveBeenCalled()

      expect(mockAnomaliesRepository.upsertMany).toHaveBeenCalledWith(
        mockAnomalies,
      )

      expect(mockAnomalyStatsRepository.upsertMany).toHaveBeenCalledWith(
        mockAnomalyStats,
      )

      expect(result).toEqual(UnixTime.toStartOf(NOW, 'day'))
    })

    it('should adjust and update', async () => {
      const mockAnomaliesRepository = mockObject<Database['anomalies']>({
        deleteAll: mockFn().resolvesTo(0),
        upsertMany: mockFn().resolvesTo(1),
      })

      const mockAnomalyStatsRepository = mockObject<Database['anomalyStats']>({
        upsertMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        tag: 'adjust-update',
        anomaliesRepository: mockAnomaliesRepository,
        anomalyStatsRepository: mockAnomalyStatsRepository,
      })

      const mockAnomalies: AnomalyRecord[] = [
        {
          timestamp: NOW - 1 * UnixTime.DAY,
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'batchSubmissions',
          duration: 100,
        },
      ]

      const mockAnomalyStats: AnomalyStatsRecord[] = [
        {
          timestamp: NOW - 1 * UnixTime.DAY,
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'batchSubmissions',
          mean: 100,
          stdDev: 50,
        },
      ]

      const mockCalculateAnomalies = mockFn().resolvesTo({
        anomalyRecords: mockAnomalies,
        anomalyStatsRecords: mockAnomalyStats,
      })
      indexer.getAnomalies = mockCalculateAnomalies

      const from = MIN
      const to = NOW

      const result = await indexer.update(from, to)

      expect(mockCalculateAnomalies).toHaveBeenCalledWith(
        UnixTime.toStartOf(NOW, 'day'),
      )

      expect(mockAnomaliesRepository.deleteAll).toHaveBeenCalled()

      expect(mockAnomaliesRepository.upsertMany).toHaveBeenCalledWith(
        mockAnomalies,
      )

      expect(mockAnomalyStatsRepository.upsertMany).toHaveBeenCalledWith(
        mockAnomalyStats,
      )

      expect(result).toEqual(UnixTime.toStartOf(NOW, 'day'))
    })
  })

  describe(AnomaliesIndexer.prototype.invalidate.name, () => {
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

  describe(AnomaliesIndexer.prototype.getAnomalies.name, () => {
    it('should get anomalies', async () => {
      const mockLivenessRecords = [
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

      const mockLivenessRepository = mockObject<Database['liveness']>({
        getRecordsInRangeWithLatestBefore:
          mockFn().resolvesTo(mockLivenessRecords),
      })

      const mockIndexerService = mockObject<IndexerService>({
        getSavedConfigurations: mockFn().resolvesTo(MOCK_CONFIGURATIONS),
      })

      const indexer = createIndexer({
        tag: 'get-anomalies',
        livenessRepository: mockLivenessRepository,
        indexerService: mockIndexerService,
      })

      const mockAnomalies: AnomalyRecord[] = [
        {
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'batchSubmissions',
          timestamp: NOW,
          duration: 3600,
        },
        {
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'proofSubmissions',
          timestamp: NOW,
          duration: 3600,
        },
        {
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'stateUpdates',
          timestamp: NOW,
          duration: 3600,
        },
      ]

      const mockStats: AnomalyStatsRecord[] = [
        {
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'batchSubmissions',
          timestamp: NOW,
          mean: 100,
          stdDev: 100,
        },
        {
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'proofSubmissions',
          timestamp: NOW,
          mean: 200,
          stdDev: 200,
        },
        {
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'stateUpdates',
          timestamp: NOW,
          mean: 300,
          stdDev: 300,
        },
      ]

      const mockDetectAnomalies = mockFn()
        .returnsOnce({
          anomalies: mockAnomalies.filter(
            (a) => a.subtype === 'batchSubmissions',
          ),
          stats: mockStats[0],
        })
        .returnsOnce({
          anomalies: mockAnomalies.filter(
            (a) => a.subtype === 'proofSubmissions',
          ),
          stats: mockStats[1],
        })
        .returnsOnce({
          anomalies: mockAnomalies.filter((a) => a.subtype === 'stateUpdates'),
          stats: mockStats[2],
        })
      indexer.detectAnomalies = mockDetectAnomalies

      const result = await indexer.getAnomalies(NOW)

      expect(
        mockLivenessRepository.getRecordsInRangeWithLatestBefore,
      ).toHaveBeenCalledWith(
        [MOCK_CONFIGURATION_ID],
        NOW - 60 * UnixTime.DAY,
        NOW,
      )

      expect(mockDetectAnomalies).toHaveBeenNthCalledWith(
        1,
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        mockLivenessRecords.map((r) => ({
          ...r,
          ...MOCK_PROJECTS[0].configurations[0],
        })),
        NOW,
      )

      expect(mockDetectAnomalies).toHaveBeenNthCalledWith(
        2,
        MOCK_PROJECTS[0].id,
        'stateUpdates',
        [],
        NOW,
      )

      expect(mockDetectAnomalies).toHaveBeenNthCalledWith(
        3,
        MOCK_PROJECTS[0].id,
        'proofSubmissions',
        [],
        NOW,
      )

      expect(result).toEqual({
        anomalyRecords: mockAnomalies,
        anomalyStatsRecords: mockStats,
      })
    })
  })

  describe(AnomaliesIndexer.prototype.detectAnomalies.name, () => {
    it('should return empty if no liveness data', async () => {
      const indexer = createIndexer({ tag: 'no-data' })

      const result = indexer.detectAnomalies(
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        [],
        NOW,
      )

      expect(result).toEqual({ anomalies: [], stats: undefined })
    })

    it('should return empty if not enough liveness data', async () => {
      const indexer = createIndexer({ tag: 'not-enough-data' })

      const lastHour = UnixTime.toStartOf(NOW, 'hour')
      // Create records that only go back 50 days (less than 2 * SYNC_RANGE = 60 days)
      const records: LivenessRecordWithConfig[] = Array.from({
        length: 100,
      }).map((_, i) =>
        mockObject<LivenessRecordWithConfig>({
          timestamp: lastHour - i * 12 * UnixTime.HOUR, // 12 hours apart = 50 days total
          subtype: 'batchSubmissions' as const,
        }),
      )

      const result = indexer.detectAnomalies(
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        records,
        NOW,
      )

      expect(result).toEqual({
        anomalies: [],
        stats: undefined,
      })
    })

    it('should not detect anomalies', async () => {
      const indexer = createIndexer({ tag: 'no-anomalies' })

      const lastHour = UnixTime.toStartOf(NOW, 'hour')
      const records: LivenessRecordWithConfig[] = Array.from({
        length: 2000,
      }).map((_, i) =>
        mockObject<LivenessRecordWithConfig>({
          timestamp: lastHour - i * UnixTime.HOUR,
          subtype: 'batchSubmissions' as const,
        }),
      )

      const result = indexer.detectAnomalies(
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        records,
        lastHour,
      )

      expect(result).toEqual({
        anomalies: [],
        stats: {
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'batchSubmissions',
          timestamp: lastHour,
          mean: 3595,
          stdDev: 134.0708767779192,
        },
      })
    })

    it('should detect anomalies', async () => {
      const indexer = createIndexer({ tag: 'anomalies' })

      const anomalyDuration = 5
      const lastHour = UnixTime.toStartOf(NOW, 'hour')
      const records: LivenessRecordWithConfig[] = Array.from({
        length: 2000,
      }).map((_, i) =>
        mockObject<LivenessRecordWithConfig>({
          timestamp: lastHour + (-i - anomalyDuration) * UnixTime.HOUR,
          subtype: 'batchSubmissions' as const,
        }),
      )

      const result = indexer.detectAnomalies(
        MOCK_PROJECTS[0].id,
        'batchSubmissions',
        records,
        lastHour,
      )

      expect(result).toEqual({
        anomalies: [
          {
            projectId: MOCK_PROJECTS[0].id,
            subtype: 'batchSubmissions',
            timestamp: lastHour - 1 * anomalyDuration * UnixTime.HOUR,
            duration: anomalyDuration * 3600,
          },
        ],
        stats: {
          projectId: MOCK_PROJECTS[0].id,
          subtype: 'batchSubmissions',
          timestamp: lastHour,
          mean: 3600,
          stdDev: 0.00010861285656770133,
        },
      })
    })
  })
})

function createIndexer(options: {
  tag: string
  livenessRepository?: Database['liveness']
  anomaliesRepository?: Database['anomalies']
  anomalyStatsRepository?: Database['anomalyStats']
  indexerService?: IndexerService
  transaction?: Database['transaction']
}) {
  return new AnomaliesIndexer({
    tags: { tag: options.tag },
    indexerService: options.indexerService ?? mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    db: mockObject<Database>({
      liveness:
        options.livenessRepository ?? mockObject<Database['liveness']>(),
      anomalies:
        options.anomaliesRepository ??
        mockObject<Database['anomalies']>({
          upsertMany: mockFn().resolvesTo(1),
        }),
      anomalyStats:
        options.anomalyStatsRepository ??
        mockObject<Database['anomalyStats']>(),
      transaction: options.transaction ?? (async (fun) => await fun()),
    }),
    projects: MOCK_PROJECTS,
  })
}
