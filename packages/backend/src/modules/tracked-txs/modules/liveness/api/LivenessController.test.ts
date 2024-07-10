import { Layer2LivenessConfig } from '@l2beat/config'
import { TrackedTxConfigEntry, createTrackedTxId } from '@l2beat/shared'
import { LivenessApiResponse, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { Project } from '../../../../../model/Project'
import { Clock } from '../../../../../tools/Clock'
import { IndexerService } from '../../../../../tools/uif/IndexerService'
import { SavedConfiguration } from '../../../../../tools/uif/multi/types'
import {
  AggregatedLivenessRecord,
  AggregatedLivenessRepository,
} from '../repositories/AggregatedLivenessRepository'
import {
  AnomaliesRecord,
  AnomaliesRepository,
} from '../repositories/AnomaliesRepository'
import { LivenessRepository } from '../repositories/LivenessRepository'
import {
  LivenessController,
  LivenessControllerDeps,
} from './LivenessController'

const NOW = UnixTime.now()
const MOCK_PROJECT_ID = ProjectId('mocked-project')
const MOCK_CONFIGURATION_ID = createTrackedTxId.random()

const MOCK_PROJECTS = [
  mockObject<Project>({
    projectId: MOCK_PROJECT_ID,
    isArchived: false,
    trackedTxsConfig: [
      mockObject<TrackedTxConfigEntry>({
        id: MOCK_CONFIGURATION_ID,
        type: 'liveness',
        subtype: 'batchSubmissions',
        untilTimestamp: UnixTime.now(),
      }),
    ],
    livenessConfig: undefined,
  }),
]

const MOCK_CONFIGURATIONS = [
  mockObject<Omit<SavedConfiguration<TrackedTxConfigEntry>, 'properties'>>({
    id: MOCK_CONFIGURATION_ID,
    maxHeight: null,
    currentHeight: NOW.add(-1, 'hours').toNumber(),
  }),
]

const MOCK_AGGREGATED_LIVENESS = [
  {
    projectId: MOCK_PROJECT_ID,
    subtype: 'batchSubmissions',
    range: '30D',
    avg: 20,
    min: 10,
    max: 30,
    updatedAt: NOW.add(-1, 'hours'),
  },
  {
    projectId: MOCK_PROJECT_ID,
    subtype: 'batchSubmissions',
    range: '90D',
    avg: 60,
    min: 10,
    max: 50,
    updatedAt: NOW.add(-1, 'hours'),
  },
  {
    projectId: MOCK_PROJECT_ID,
    subtype: 'batchSubmissions',
    range: 'MAX',
    avg: 10,
    min: 40,
    max: 70,
    updatedAt: NOW.add(-1, 'hours'),
  },
] as AggregatedLivenessRecord[]

const MOCK_ANOMALIES = [
  {
    projectId: MOCK_PROJECT_ID,
    timestamp: NOW.add(-1, 'hours'),
    subtype: 'batchSubmissions',
    duration: 10,
  },
  {
    projectId: MOCK_PROJECT_ID,
    timestamp: NOW.add(-2, 'hours'),
    subtype: 'batchSubmissions',
    duration: 20,
  },
  {
    projectId: MOCK_PROJECT_ID,
    timestamp: NOW.add(-3, 'hours'),
    subtype: 'batchSubmissions',
    duration: 30,
  },
] as AnomaliesRecord[]

const MOCK_LIVENESS_DATA = {
  last30Days: {
    averageInSeconds: MOCK_AGGREGATED_LIVENESS[0].avg,
    minimumInSeconds: MOCK_AGGREGATED_LIVENESS[0].min,
    maximumInSeconds: MOCK_AGGREGATED_LIVENESS[0].max,
  },
  last90Days: {
    averageInSeconds: MOCK_AGGREGATED_LIVENESS[1].avg,
    minimumInSeconds: MOCK_AGGREGATED_LIVENESS[1].min,
    maximumInSeconds: MOCK_AGGREGATED_LIVENESS[1].max,
  },
  allTime: {
    averageInSeconds: MOCK_AGGREGATED_LIVENESS[2].avg,
    minimumInSeconds: MOCK_AGGREGATED_LIVENESS[2].min,
    maximumInSeconds: MOCK_AGGREGATED_LIVENESS[2].max,
  },
  syncedUntil: new UnixTime(MOCK_CONFIGURATIONS[0].currentHeight!),
}

const MOCK_ANOMALIES_DATA = MOCK_ANOMALIES.map((a) => ({
  timestamp: new UnixTime(a.timestamp.toNumber() + a.duration),
  durationInSeconds: a.duration,
  type: a.subtype,
}))

describe(LivenessController.name, () => {
  describe(LivenessController.prototype.getLiveness.name, () => {
    it('should return latest liveness data', async () => {
      const mockIndexerService = mockObject<IndexerService>({
        getSavedConfigurations: mockFn().resolvesTo(MOCK_CONFIGURATIONS),
      })

      const mockAggregatedLivenessRepository =
        mockObject<AggregatedLivenessRepository>({
          getByProject: mockFn().resolvesTo(MOCK_AGGREGATED_LIVENESS),
        })

      const mockAnomaliesRepository = mockObject<AnomaliesRepository>({
        getByProjectFrom: mockFn().resolvesTo(MOCK_ANOMALIES),
      })

      const controller = createLivenessController({
        indexerService: mockIndexerService,
        aggregatedLivenessRepository: mockAggregatedLivenessRepository,
        anomaliesRepository: mockAnomaliesRepository,
      })

      const mockMapAggregatedLivenessRecords =
        mockFn().returns(MOCK_LIVENESS_DATA)
      controller.mapAggregatedLivenessRecords = mockMapAggregatedLivenessRecords

      const mockMapAnomalyRecords = mockFn().returns(MOCK_ANOMALIES_DATA)
      controller.mapAnomalyRecords = mockMapAnomalyRecords

      const result = await controller.getLiveness()

      expect(mockIndexerService.getSavedConfigurations).toHaveBeenCalledWith(
        'tracked_txs_indexer',
      )

      expect(
        mockAggregatedLivenessRepository.getByProject,
      ).toHaveBeenCalledWith(MOCK_PROJECT_ID)

      expect(mockAnomaliesRepository.getByProjectFrom).toHaveBeenCalledWith(
        MOCK_PROJECT_ID,
        UnixTime.now().add(-30, 'days').toStartOf('day'),
      )

      expect(mockMapAggregatedLivenessRecords).toHaveBeenNthCalledWith(
        1,
        MOCK_AGGREGATED_LIVENESS,
        'stateUpdates',
        MOCK_PROJECTS[0],
        MOCK_CONFIGURATIONS,
      )

      expect(mockMapAggregatedLivenessRecords).toHaveBeenNthCalledWith(
        2,
        MOCK_AGGREGATED_LIVENESS,
        'batchSubmissions',
        MOCK_PROJECTS[0],
        MOCK_CONFIGURATIONS,
      )

      expect(mockMapAggregatedLivenessRecords).toHaveBeenNthCalledWith(
        3,
        MOCK_AGGREGATED_LIVENESS,
        'proofSubmissions',
        MOCK_PROJECTS[0],
        MOCK_CONFIGURATIONS,
      )

      expect(mockMapAnomalyRecords).toHaveBeenCalledWith(MOCK_ANOMALIES)

      const projects: LivenessApiResponse['projects'] = {}
      projects[MOCK_PROJECT_ID.toString()] = {
        stateUpdates: MOCK_LIVENESS_DATA,
        batchSubmissions: MOCK_LIVENESS_DATA,
        proofSubmissions: MOCK_LIVENESS_DATA,
        anomalies: MOCK_ANOMALIES_DATA,
      }

      expect(result).toEqual({ type: 'success', data: { projects } })
    })

    it('should duplicate liveness data if configured', async () => {
      const project = {
        ...MOCK_PROJECTS[0],
        livenessConfig: {
          duplicateData: {
            from: 'stateUpdates',
            to: 'proofSubmissions',
          },
        } as Layer2LivenessConfig,
      }

      const controller = createLivenessController({
        projects: [project],
        indexerService: mockObject<IndexerService>({
          getSavedConfigurations: mockFn().resolvesTo(MOCK_CONFIGURATIONS),
        }),
        aggregatedLivenessRepository: mockObject<AggregatedLivenessRepository>({
          getByProject: mockFn().resolvesTo(MOCK_AGGREGATED_LIVENESS),
        }),
        anomaliesRepository: mockObject<AnomaliesRepository>({
          getByProjectFrom: mockFn().resolvesTo(MOCK_ANOMALIES),
        }),
      })

      const modifiedLivenessData = {
        ...MOCK_LIVENESS_DATA,
        allTime: {
          averageInSeconds: 0,
          minimumInSeconds: 0,
          maximumInSeconds: 0,
        },
      }

      controller.mapAggregatedLivenessRecords = mockFn()
        .returnsOnce(MOCK_LIVENESS_DATA)
        .returnsOnce(MOCK_LIVENESS_DATA)
        .returnsOnce(modifiedLivenessData)

      controller.mapAnomalyRecords = mockFn().returns(MOCK_ANOMALIES_DATA)

      const result = await controller.getLiveness()

      const projects: LivenessApiResponse['projects'] = {}
      projects[MOCK_PROJECT_ID.toString()] = {
        batchSubmissions: MOCK_LIVENESS_DATA,
        stateUpdates: MOCK_LIVENESS_DATA,
        proofSubmissions: MOCK_LIVENESS_DATA,
        anomalies: MOCK_ANOMALIES_DATA,
      }

      expect(result).toEqual({ type: 'success', data: { projects } })
    })
  })

  describe(
    LivenessController.prototype.mapAggregatedLivenessRecords.name,
    () => {
      it('should map aggregated liveness records', () => {
        const controller = createLivenessController()

        const result = controller.mapAggregatedLivenessRecords(
          MOCK_AGGREGATED_LIVENESS,
          'batchSubmissions',
          MOCK_PROJECTS[0],
          MOCK_CONFIGURATIONS,
        )

        expect(result).toEqual(MOCK_LIVENESS_DATA)
      })
    },
  )

  describe(LivenessController.prototype.mapAnomalyRecords.name, () => {
    it('should map anomaly records', () => {
      const controller = createLivenessController()

      const result = controller.mapAnomalyRecords(MOCK_ANOMALIES)

      expect(result).toEqual(MOCK_ANOMALIES_DATA)
    })
  })
})

function createLivenessController(deps?: Partial<LivenessControllerDeps>) {
  return new LivenessController({
    indexerService: mockObject<IndexerService>({
      getSavedConfigurations: mockFn().resolvesTo(MOCK_CONFIGURATIONS),
    }),
    aggregatedLivenessRepository: mockObject<AggregatedLivenessRepository>(),
    anomaliesRepository: mockObject<AnomaliesRepository>(),
    livenessRepository: mockObject<LivenessRepository>(),
    projects: MOCK_PROJECTS,
    clock: mockObject<Clock>(),
    ...deps,
  })
}
