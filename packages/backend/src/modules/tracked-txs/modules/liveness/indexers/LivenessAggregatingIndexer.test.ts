import { Logger } from '@l2beat/backend-tools'
import {
  TrackedTxConfigEntry,
  TrackedTxUseWithId,
  TrackedTxsConfig,
} from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Project } from '../../../../../model/Project'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
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

const MOCK_PROJECTS = [
  mockObject<Project>({
    projectId: ProjectId('mocked-project'),
    isArchived: false,
    trackedTxsConfig: mockObject<TrackedTxsConfig>({
      entries: [
        mockObject<TrackedTxConfigEntry>({
          uses: [
            mockObject<TrackedTxUseWithId>({
              type: 'liveness',
              subtype: 'batchSubmissions',
            }),
          ],
          untilTimestampExclusive: UnixTime.now(),
        }),
      ],
    }),
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
    it('should return parent safe height of not enough data', async () => {
      const indexer = createIndexer()
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      const safeHeigh = MIN.toNumber()
      const parentSafeHeight = NOW.add(-2, 'days').toNumber()

      const result = await indexer.update(safeHeigh, parentSafeHeight)

      expect(mockGenerateLiveness).not.toHaveBeenCalled()

      expect(result).toEqual(parentSafeHeight)
    })

    it('should skip if already up to date', async () => {
      const indexer = createIndexer()
      const mockGenerateLiveness = mockFn().resolvesTo([])
      indexer.generateLiveness = mockGenerateLiveness

      const safeHeight = NOW.add(-2, 'hours').toNumber()
      const parentSafeHeight = NOW.add(-1, 'hours').toNumber()

      const result = await indexer.update(safeHeight, parentSafeHeight)

      expect(mockGenerateLiveness).not.toHaveBeenCalled()

      expect(result).toEqual(parentSafeHeight)
    })

    it('should generate liveness data and save it to DB', async () => {
      const mockLivenessRepository = mockObject<AggregatedLivenessRepository>({
        addOrUpdateMany: mockFn().resolvesTo(1),
      })

      const indexer = createIndexer({
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
          timestamp: NOW,
        },
      ]

      const mockGenerateLiveness = mockFn().resolvesTo(mockLiveness)
      indexer.generateLiveness = mockGenerateLiveness

      const safeHeight = NOW.add(-1, 'days')
      const parentSafeHeight = NOW.add(-1, 'hours')

      const result = await indexer.update(
        safeHeight.toNumber(),
        parentSafeHeight.toNumber(),
      )

      expect(mockGenerateLiveness).toHaveBeenCalledWith(
        safeHeight.toEndOf('day').add(-1, 'seconds'),
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

      const safeHightMock = UnixTime.now().toNumber()

      const indexer = createIndexer({
        livenessRepository: livenessRepositoryMock,
      })

      const result = await indexer.invalidate(safeHightMock)

      expect(livenessRepositoryMock.deleteAll).not.toHaveBeenCalled()

      expect(result).toEqual(safeHightMock)
    })
  })

  describe(LivenessAggregatingIndexer.prototype.generateLiveness.name, () => {
    it('should generate aggregated liveness', async () => {
      const mockLivenessRepository = mockObject<LivenessRepository>({
        getWithSubtypeByProjectIdsUpTo: mockFn().resolvesTo(MOCK_LIVENESS),
      })
      const indexer = createIndexer({
        livenessRepository: mockLivenessRepository,
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
          timestamp: NOW,
        },
        {
          avg: 10800,
          max: 14400,
          min: 7200,
          projectId: 'mocked-project',
          range: '90D',
          subtype: 'batchSubmissions',
          timestamp: NOW,
        },
        {
          avg: 10800,
          max: 14400,
          min: 7200,
          projectId: 'mocked-project',
          range: 'MAX',
          subtype: 'batchSubmissions',
          timestamp: NOW,
        },
      ])
    })
  })

  describe(LivenessAggregatingIndexer.prototype.aggregatedRecords.name, () => {
    it('should aggregate records', async () => {
      const indexer = createIndexer()

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
          timestamp: NOW,
        },
      ])
    })
  })

  describe(LivenessAggregatingIndexer.prototype.filterByRange.name, () => {
    it('should filter intervals by range', async () => {
      const indexer = createIndexer()

      const result = indexer.filterByRange(MOCK_INTERVALS, NOW, '30D')

      expect(result).toEqual(MOCK_INTERVALS.splice(0, 2))
    })
  })

  describe(LivenessAggregatingIndexer.prototype.calculateStats.name, () => {
    it('should calculate stats', async () => {
      const indexer = createIndexer()

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
