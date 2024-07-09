import { Logger } from '@l2beat/backend-tools'
import { TrackedTxConfigEntry, createTrackedTxId } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Project } from '../../../../../model/Project'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import {
  AggregatedLivenessRecord,
  AggregatedLivenessRepository,
} from '../repositories/AggregatedLivenessRepository'
import {
  LivenessRecordWithSubtype,
  LivenessRepository,
} from '../repositories/LivenessRepository'
import { Interval } from '../utils/calculateIntervals'
import {
  LivenessAggregatingIndexer,
  LivenessAggregatingIndexerDeps,
} from './LivenessAggregatingIndexer'

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

const MOCK_INTERVALS: Interval[] = [
  {
    record: {
      subtype: 'batchSubmissions',
      timestamp: NOW.add(-1, 'days'),
    },
    duration: 10,
  },
  {
    record: {
      subtype: 'batchSubmissions',
      timestamp: NOW.add(-10, 'days'),
    },
    duration: 20,
  },
  {
    record: {
      subtype: 'batchSubmissions',
      timestamp: NOW.add(-40, 'days'),
    },
    duration: 30,
  },
]

const MOCK_LIVENESS: LivenessRecordWithSubtype[] = [
  {
    timestamp: NOW.add(-1, 'hours'),
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-3, 'hours'),
    subtype: 'batchSubmissions',
  },
  {
    timestamp: NOW.add(-7, 'hours'),
    subtype: 'batchSubmissions',
  },
]

describe(LivenessAggregatingIndexer.name, () => {
  describe(LivenessAggregatingIndexer.prototype.update.name, () => {
    it('should return parent safe height if not enough data', async () => {
      const indexer = createIndexer({ tag: 'update-return' })
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      const safeHeigh = MIN.toNumber()
      const parentSafeHeight = NOW.add(-2, 'days').toNumber()

      const result = await indexer.update(safeHeigh, parentSafeHeight)

      expect(mockGenerateLiveness).not.toHaveBeenCalled()

      expect(result).toEqual(parentSafeHeight)
    })

    it('should skip if already up to date', async () => {
      const indexer = createIndexer({ tag: 'update-skip' })
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      const safeHeight = NOW.add(-2, 'hours').toNumber()
      const parentSafeHeight = NOW.add(-1, 'hours').toNumber()

      const result = await indexer.update(safeHeight, parentSafeHeight)

      expect(mockGenerateLiveness).not.toHaveBeenCalled()

      expect(result).toEqual(parentSafeHeight)
    })

    it('should adjust target height and generate liveness data', async () => {
      const mockLivenessRepository = mockObject<AggregatedLivenessRepository>({
        addOrUpdateMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
        tag: 'update',
        aggregatedLivenessRepository: mockLivenessRepository,
      })
      const mockLiveness: AggregatedLivenessRecord[] = [
        {
          projectId: MOCK_PROJECTS[0].projectId,
          subtype: 'batchSubmissions',
          range: '30D',
          min: 10,
          avg: 20,
          max: 30,
          updatedAt: NOW,
        },
      ]

      const mockGenerateLiveness = mockFn().resolvesTo(mockLiveness)
      indexer.generateLiveness = mockGenerateLiveness

      const safeHeight = NOW.add(-4, 'days')
      const parentSafeHeight = NOW.add(-1, 'hours')

      const result = await indexer.update(
        safeHeight.toNumber(),
        parentSafeHeight.toNumber(),
      )

      expect(mockGenerateLiveness).toHaveBeenCalledWith(
        NOW.toStartOf('day').add(-1, 'seconds'),
      )

      expect(mockLivenessRepository.addOrUpdateMany).toHaveBeenCalledWith(
        mockLiveness,
      )

      expect(result).toEqual(parentSafeHeight.toNumber())
    })
  })

  describe(LivenessAggregatingIndexer.prototype.invalidate.name, () => {
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

  describe(LivenessAggregatingIndexer.prototype.generateLiveness.name, () => {
    it('should generate aggregated liveness', async () => {
      const mockLivenessRepository = mockObject<LivenessRepository>({
        getWithSubtypeByProjectIdsUpTo: mockFn().resolvesTo(MOCK_LIVENESS),
      })

      const mockIndexerService = mockObject<IndexerService>({
        getSavedConfigurations: mockFn().resolvesTo(MOCK_CONFIGURATIONS),
      })

      const indexer = createIndexer({
        tag: 'generateLiveness',
        livenessRepository: mockLivenessRepository,
        indexerService: mockIndexerService,
      })

      const result = await indexer.generateLiveness(NOW)

      expect(
        mockLivenessRepository.getWithSubtypeByProjectIdsUpTo,
      ).toHaveBeenCalledWith(MOCK_PROJECTS[0].projectId, NOW)

      expect(result).toEqual([
        {
          avg: 10800,
          max: 14400,
          min: 7200,
          projectId: 'mocked-project',
          range: '30D',
          subtype: 'batchSubmissions',
          updatedAt: NOW,
        },
        {
          avg: 10800,
          max: 14400,
          min: 7200,
          projectId: 'mocked-project',
          range: '90D',
          subtype: 'batchSubmissions',
          updatedAt: NOW,
        },
        {
          avg: 10800,
          max: 14400,
          min: 7200,
          projectId: 'mocked-project',
          range: 'MAX',
          subtype: 'batchSubmissions',
          updatedAt: NOW,
        },
      ])
    })
  })

  describe(LivenessAggregatingIndexer.prototype.aggregatedRecords.name, () => {
    it('should aggregate records', async () => {
      const indexer = createIndexer({ tag: 'aggregatedRecords' })

      const result = indexer.aggregatedRecords(
        MOCK_PROJECTS[0].projectId,
        'batchSubmissions',
        MOCK_LIVENESS,
        NOW,
        ['30D'],
      )

      expect(result).toEqual([
        {
          avg: 10800,
          max: 14400,
          min: 7200,
          projectId: 'mocked-project',
          range: '30D',
          subtype: 'batchSubmissions',
          updatedAt: NOW,
        },
      ])
    })
  })

  describe(LivenessAggregatingIndexer.prototype.filterByRange.name, () => {
    it('should filter intervals by range', async () => {
      const indexer = createIndexer({ tag: 'filterByRange' })

      const result = indexer.filterByRange(MOCK_INTERVALS, NOW, '30D')

      expect(result).toEqual([...MOCK_INTERVALS].splice(0, 2))
    })
  })

  describe(LivenessAggregatingIndexer.prototype.calculateStats.name, () => {
    it('should calculate stats', async () => {
      const indexer = createIndexer({ tag: 'calculateStats' })

      const result = indexer.calculateStats(MOCK_INTERVALS)

      expect(result).toEqual({
        averageInSeconds: 20,
        minimumInSeconds: 10,
        maximumInSeconds: 30,
      })
    })
  })
})

function createIndexer(deps?: Partial<LivenessAggregatingIndexerDeps>) {
  return new LivenessAggregatingIndexer({
    indexerService: mockObject<IndexerService>(),
    logger: Logger.SILENT,
    minHeight: 0,
    parents: [],
    livenessRepository: mockObject<LivenessRepository>(),
    aggregatedLivenessRepository: mockObject<AggregatedLivenessRepository>({
      addOrUpdateMany: mockFn().resolvesTo(1),
    }),
    projects: MOCK_PROJECTS,
    ...deps,
  })
}
