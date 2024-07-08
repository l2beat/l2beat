import { Logger } from '@l2beat/backend-tools'
import { TrackedTxConfigEntry, createTrackedTxId } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Project } from '../../../../../model/Project'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import {
  AnomaliesRecord,
  AnomaliesRepository,
} from '../repositories/AnomaliesRepository'
import {
  LivenessRecordWithSubtype,
  LivenessRepository,
} from '../repositories/LivenessRepository'
import {
  AnomaliesIndexer,
  AnomaliesIndexerIndexerDeps,
} from './AnomaliesIndexer'

const NOW = UnixTime.now()
const MIN = NOW.add(-100, 'days')

const MOCK_CONFIGURATION_ID = createTrackedTxId.random()

const MOCK_PROJECTS = [
  mockObject<Project>({
    projectId: ProjectId('mocked-project'),
    isArchived: false,
    trackedTxsConfig: [
      mockObject<TrackedTxConfigEntry>({
        id: MOCK_CONFIGURATION_ID,
        type: 'liveness',
        subtype: 'batchSubmissions',
        untilTimestamp: UnixTime.now(),
      }),
    ],
  }),
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

      const mockcalculateAnomalies = mockFn().resolvesTo([])
      indexer.getAnomalies = mockcalculateAnomalies

      const from = MIN.toNumber()
      const to = NOW.add(-2, 'days').toNumber()

      const result = await indexer.update(from, to)

      expect(mockcalculateAnomalies).not.toHaveBeenCalled()

      expect(result).toEqual(to)
    })

    it('should update', async () => {
      const mockAnomaliesRepository = mockObject<AnomaliesRepository>({
        addOrUpdateMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        tag: 'update',
        anomaliesRepository: mockAnomaliesRepository,
      })

      const mockAnomalies: AnomaliesRecord[] = [
        {
          timestamp: NOW.add(-1, 'days'),
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'batchSubmissions',
          duration: 100,
        },
      ]

      const mockCalculateAnomalies = mockFn().resolvesTo(mockAnomalies)
      indexer.getAnomalies = mockCalculateAnomalies

      const from = NOW.add(-1, 'days').add(-1, 'hours').toNumber()
      const to = NOW

      const result = await indexer.update(from, to.toNumber())

      expect(mockCalculateAnomalies).toHaveBeenCalledWith(NOW.toStartOf('day'))

      expect(mockAnomaliesRepository.addOrUpdateMany).toHaveBeenCalledWith(
        mockAnomalies,
      )

      expect(result).toEqual(NOW.toStartOf('day').toNumber())
    })

    it('should adjust and update', async () => {
      const mockAnomaliesRepository = mockObject<AnomaliesRepository>({
        addOrUpdateMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        tag: 'adjust-update',
        anomaliesRepository: mockAnomaliesRepository,
      })

      const mockAnomalies: AnomaliesRecord[] = [
        {
          timestamp: NOW.add(-1, 'days'),
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'batchSubmissions',
          duration: 100,
        },
      ]

      const mockCalculateAnomalies = mockFn().resolvesTo(mockAnomalies)
      indexer.getAnomalies = mockCalculateAnomalies

      const from = MIN.toNumber()
      const to = NOW

      const result = await indexer.update(from, to.toNumber())

      expect(mockCalculateAnomalies).toHaveBeenCalledWith(NOW.toStartOf('day'))

      expect(mockAnomaliesRepository.addOrUpdateMany).toHaveBeenCalledWith(
        mockAnomalies,
      )

      expect(result).toEqual(NOW.toStartOf('day').toNumber())
    })
  })

  describe(AnomaliesIndexer.prototype.invalidate.name, () => {
    it('should return new safeHeigh and not delete data', async () => {
      const livenessRepositoryMock = mockObject<LivenessRepository>({
        deleteAll: mockFn().resolvesTo(1),
      })

      const targetHeight = UnixTime.now().toNumber()

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
        {
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'batchSubmissions',
          timestamp: NOW,
        },
        {
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'proofSubmissions',
          timestamp: NOW,
        },
        {
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'stateUpdates',
          timestamp: NOW,
        },
      ]

      const mockLivenessRepository = mockObject<LivenessRepository>({
        getWithSubtypeByProjectIdsWithinTimeRange:
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

      const mockAnomalies: AnomaliesRecord[] = [
        {
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'batchSubmissions',
          timestamp: NOW,
          duration: 3600,
        },
        {
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'proofSubmissions',
          timestamp: NOW,
          duration: 3600,
        },
        {
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'stateUpdates',
          timestamp: NOW,
          duration: 3600,
        },
      ]

      const mockDetectAnomalies = mockFn()
        .returnsOnce(
          mockAnomalies.filter((a) => a.subtype === 'batchSubmissions'),
        )
        .returnsOnce(
          mockAnomalies.filter((a) => a.subtype === 'proofSubmissions'),
        )
        .returnsOnce(mockAnomalies.filter((a) => a.subtype === 'stateUpdates'))
      indexer.detectAnomalies = mockDetectAnomalies

      const result = await indexer.getAnomalies(NOW)

      expect(
        mockLivenessRepository.getWithSubtypeByProjectIdsWithinTimeRange,
      ).toHaveBeenCalledWith(
        MOCK_PROJECTS[0].projectId,
        NOW.add(-60, 'days'),
        NOW,
      )

      expect(mockDetectAnomalies).toHaveBeenNthCalledWith(
        1,
        MOCK_PROJECTS[0].projectId,
        'batchSubmissions',
        mockLivenessRecords.filter((r) => r.subtype === 'batchSubmissions'),
        NOW,
      )

      expect(mockDetectAnomalies).toHaveBeenNthCalledWith(
        2,
        MOCK_PROJECTS[0].projectId,
        'stateUpdates',
        mockLivenessRecords.filter((r) => r.subtype === 'stateUpdates'),
        NOW,
      )

      expect(mockDetectAnomalies).toHaveBeenNthCalledWith(
        3,
        MOCK_PROJECTS[0].projectId,
        'proofSubmissions',
        mockLivenessRecords.filter((r) => r.subtype === 'proofSubmissions'),
        NOW,
      )

      expect(result).toEqual(mockAnomalies)
    })
  })

  describe(AnomaliesIndexer.prototype.detectAnomalies.name, () => {
    it('should return empty if no liveness data', async () => {
      const indexer = createIndexer({ tag: 'no-data' })

      const result = indexer.detectAnomalies(
        MOCK_PROJECTS[0].projectId,
        'batchSubmissions',
        [],
        NOW,
      )

      expect(result).toEqual([])
    })

    it('should return empty if not enough liveness data', async () => {
      const indexer = createIndexer({ tag: 'not-enough-data' })

      const lastHour = NOW.toStartOf('hour')
      const records: LivenessRecordWithSubtype[] = Array.from({
        length: 1000,
      }).map((_, i) => ({
        timestamp: lastHour.add(-i, 'hours'),
        subtype: 'batchSubmissions' as const,
      }))

      const result = indexer.detectAnomalies(
        MOCK_PROJECTS[0].projectId,
        'batchSubmissions',
        records,
        NOW,
      )

      expect(result).toEqual([])
    })

    it('should not detect anomalies', async () => {
      const indexer = createIndexer({ tag: 'no-anomalies' })

      const lastHour = NOW.toStartOf('hour')
      const records: LivenessRecordWithSubtype[] = Array.from({
        length: 2000,
      }).map((_, i) => ({
        timestamp: lastHour.add(-i, 'hours'),
        subtype: 'batchSubmissions' as const,
      }))

      const result = indexer.detectAnomalies(
        MOCK_PROJECTS[0].projectId,
        'batchSubmissions',
        records,
        lastHour,
      )

      expect(result).toEqual([])
    })

    it('should detect anomalies', async () => {
      const indexer = createIndexer({ tag: 'anomalies' })

      const anomalyDuration = 5
      const lastHour = NOW.toStartOf('hour')
      const records: LivenessRecordWithSubtype[] = Array.from({
        length: 2000,
      }).map((_, i) => ({
        timestamp: lastHour.add(-i - anomalyDuration, 'hours'),
        subtype: 'batchSubmissions' as const,
      }))

      const result = indexer.detectAnomalies(
        MOCK_PROJECTS[0].projectId,
        'batchSubmissions',
        records,
        lastHour,
      )

      expect(result).toEqual([
        {
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'batchSubmissions',
          timestamp: lastHour.add(-1 * anomalyDuration, 'hours'),
          duration: anomalyDuration * 3600,
        },
      ])
    })
  })
})

function createIndexer(deps?: Partial<AnomaliesIndexerIndexerDeps>) {
  return new AnomaliesIndexer({
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    livenessRepository: mockObject<LivenessRepository>(),
    anomaliesRepository: mockObject<AnomaliesRepository>({
      addOrUpdateMany: mockFn().resolvesTo(1),
    }),
    projects: MOCK_PROJECTS,
    ...deps,
  })
}
