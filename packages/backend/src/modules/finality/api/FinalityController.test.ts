import { FinalityType, StateUpdateMode } from '@l2beat/config'
import {
  assert,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'

import {
  Database,
  FinalityRecord,
  IndexerConfigurationRecord,
  LivenessRecord,
} from '@l2beat/database'
import { createTrackedTxId } from '@l2beat/shared'
import { FinalityProjectConfig } from '../../../config/features/finality'
import { calculateIntervals } from '../../tracked-txs/modules/liveness/utils/calculateIntervals'
import { calculateStats } from '../../tracked-txs/modules/liveness/utils/calculateStats'
import { filterIntervalsByRange } from '../../tracked-txs/modules/liveness/utils/filterIntervalsByRange'
import { FinalityController } from './FinalityController'

const START = UnixTime.now()

describe(FinalityController.name, () => {
  describe(FinalityController.prototype.getFinality.name, () => {
    it('returns empty object if no data', async () => {
      const finalityController = new FinalityController({
        projects: [],
        db: mockObject<Database>({
          finality: getMockFinalityRepository([]),
          liveness: getMockLivenessRepository([]),
          indexerConfiguration: mockObject<Database['indexerConfiguration']>({
            getSavedConfigurations: mockFn().resolvesTo([]),
          }),
        }),
      })

      const result = await finalityController.getFinality()
      expect(result).toEqual({ projects: {} })
    })

    it('correctly calculate avg, min and max', async () => {
      const mockConfigurationId = createTrackedTxId.random()

      const mockConfiguration = mockObject<IndexerConfigurationRecord>({
        id: mockConfigurationId,
        properties: JSON.stringify({
          projectId: ProjectId('project1'),
          type: 'liveness',
          subtype: 'batchSubmissions',
        }),
        currentHeight: START.toNumber(),
      })

      const RECORDS: LivenessRecord[] = [
        ...range(5).map((_, i) =>
          mockObject<LivenessRecord>({
            configurationId: mockConfigurationId,
            timestamp: START.add(-i, 'days'),
          }),
        ),
        ...range(5).map((_, i) =>
          mockObject<LivenessRecord>({
            configurationId: mockConfigurationId,
            timestamp: START.add(-(5 + i * 2), 'days'),
          }),
        ),
      ]

      const project2Result = {
        projectId: ProjectId('project2'),
        timestamp: new UnixTime(1000),
        minimumTimeToInclusion: 1,
        averageTimeToInclusion: 2,
        maximumTimeToInclusion: 3,
        minimumStateUpdate: 2,
        averageStateUpdate: 3,
        maximumStateUpdate: 4,
      }
      const finalityController = new FinalityController({
        db: mockObject<Database>({
          finality: getMockFinalityRepository([project2Result]),
          liveness: getMockLivenessRepository(RECORDS),
          indexerConfiguration: mockObject<Database['indexerConfiguration']>({
            getSavedConfigurations: mockFn().resolvesTo([mockConfiguration]),
          }),
        }),
        projects: mockProjectConfig([
          {
            projectId: ProjectId('project1'),
            lag: 0,
            type: 'OPStack',
            stateUpdate: 'disabled',
          },
          {
            projectId: ProjectId('project2'),
            lag: 0,
            type: 'Linea',
            stateUpdate: 'analyze',
          },
        ]),
      })

      const recordsWithConfig = RECORDS.map((r) => ({
        ...r,
        id: mockConfigurationId,
        subtype: 'batchSubmissions' as TrackedTxsConfigSubtype,
      }))

      const intervals = calculateIntervals(recordsWithConfig)
      const filteredIntervals = filterIntervalsByRange(
        intervals,
        UnixTime.now(),
        '30D',
      )

      const last30Days = calculateStats(filteredIntervals)

      assert(last30Days, 'last30Days is undefined')

      const result = await finalityController.getFinality()

      expect(result.projects.project1).toEqual({
        timeToInclusion: {
          averageInSeconds: last30Days.averageInSeconds / 2 + 0,
          maximumInSeconds: last30Days.maximumInSeconds,
        },
        stateUpdateDelays: null,
        syncedUntil: recordsWithConfig[0].timestamp,
      })
      expect(result.projects.project2).toEqual({
        timeToInclusion: {
          averageInSeconds: project2Result.averageTimeToInclusion,
          maximumInSeconds: project2Result.maximumTimeToInclusion,
          minimumInSeconds: project2Result.minimumTimeToInclusion,
        },
        stateUpdateDelays: {
          // Respective 1 sec diff
          averageInSeconds: 1,
        },
        syncedUntil: project2Result.timestamp,
      })
    })
  })

  describe(FinalityController.prototype.getOPStackFinality.name, () => {
    it('correctly calculate avg, min and max', async () => {
      const mockConfigurationId1 = createTrackedTxId.random()

      const mockConfiguration1 = mockObject<IndexerConfigurationRecord>({
        id: mockConfigurationId1,
        properties: JSON.stringify({
          projectId: ProjectId('project1'),
          type: 'liveness',
          subtype: 'batchSubmissions',
        }),
        currentHeight: START.toNumber(),
      })

      const mockConfigurationId2 = createTrackedTxId.random()

      const mockConfiguration2 = mockObject<IndexerConfigurationRecord>({
        id: mockConfigurationId2,
        properties: JSON.stringify({
          projectId: ProjectId('project2'),
          type: 'liveness',
          subtype: 'batchSubmissions',
        }),
        currentHeight: null,
      })

      const RECORDS: LivenessRecord[] = [
        ...range(5).map((_, i) =>
          mockObject<LivenessRecord>({
            configurationId: mockConfigurationId1,
            timestamp: START.add(-i, 'days'),
          }),
        ),

        ...range(3).map((_, i) =>
          mockObject<LivenessRecord>({
            configurationId: mockConfigurationId1,
            timestamp: START.add(-(5 + i * 2), 'days'),
          }),
        ),
        ...range(5).map((_, i) =>
          mockObject<LivenessRecord>({
            configurationId: mockConfigurationId2,
            timestamp: START.add(-i, 'days'),
          }),
        ),
        ...range(3).map((_, i) =>
          mockObject<LivenessRecord>({
            configurationId: mockConfigurationId2,
            timestamp: START.add(-(5 + i * 2), 'days'),
          }),
        ),
      ]

      const projects = mockProjectConfig([
        {
          projectId: ProjectId('project1'),
          lag: 0,
          type: 'OPStack',
          stateUpdate: 'disabled',
        },
      ])
      const finalityController = new FinalityController({
        projects,
        db: mockObject<Database>({
          finality: getMockFinalityRepository([]),
          liveness: getMockLivenessRepository(RECORDS),
          indexerConfiguration: mockObject<Database['indexerConfiguration']>({
            getSavedConfigurations: mockFn().resolvesTo([
              mockConfiguration1,
              mockConfiguration2,
            ]),
          }),
        }),
      })

      const project1LivenessWithConfig = RECORDS.filter(
        (r) => r.configurationId === mockConfigurationId1,
      ).map((r) => ({
        ...r,
        id: mockConfigurationId1,
        subtype: 'batchSubmissions' as TrackedTxsConfigSubtype,
      }))

      const intervals = calculateIntervals(project1LivenessWithConfig)
      const filteredIntervals = filterIntervalsByRange(
        intervals,
        UnixTime.now(),
        '30D',
      )
      const project1Last30Days = calculateStats(filteredIntervals)

      assert(project1Last30Days, 'last30Days is undefined')

      const result = await finalityController.getOPStackFinality(projects)
      expect(result).toEqual({
        project1: {
          timeToInclusion: {
            averageInSeconds: project1Last30Days.averageInSeconds / 2 + 0,
            maximumInSeconds: project1Last30Days.maximumInSeconds,
          },
          stateUpdateDelays: null,
          syncedUntil: START,
        },
      })
    })
  })

  describe(FinalityController.prototype.getProjectsFinality.name, () => {
    it('gets finality records for all projects with one undefined', async () => {
      const projects = mockProjectConfig([
        {
          projectId: ProjectId('project1'),
          lag: 0,
          type: 'Linea',
          stateUpdate: 'analyze',
        },
        {
          projectId: ProjectId('project2'),
          lag: 0,
          type: 'Linea',
          stateUpdate: 'zeroed',
        },
        {
          projectId: ProjectId('project3'),
          lag: 0,
          type: 'Linea',
          stateUpdate: 'disabled',
        },
        {
          projectId: ProjectId('project4'),
          lag: 0,
          type: 'Linea',
          stateUpdate: 'analyze',
        },
      ])
      const finalityController = new FinalityController({
        db: mockObject<Database>({
          liveness: getMockLivenessRepository([]),
          finality: getMockFinalityRepository([
            {
              projectId: ProjectId('project1'),
              timestamp: new UnixTime(1000),
              minimumTimeToInclusion: 1,
              averageTimeToInclusion: 2,
              maximumTimeToInclusion: 3,
              averageStateUpdate: 3,
            },
            {
              projectId: ProjectId('project2'),
              timestamp: new UnixTime(1000),
              minimumTimeToInclusion: 4,
              averageTimeToInclusion: 5,
              maximumTimeToInclusion: 6,
              averageStateUpdate: null,
            },
            {
              projectId: ProjectId('project3'),
              timestamp: new UnixTime(12000),
              minimumTimeToInclusion: 7,
              averageTimeToInclusion: 8,
              maximumTimeToInclusion: 9,
              averageStateUpdate: null,
            },
          ]),
          indexerConfiguration: mockObject<Database['indexerConfiguration']>(
            {},
          ),
        }),
        projects,
      })

      const result = await finalityController.getProjectsFinality(projects)

      expect(result).toEqual({
        project1: {
          timeToInclusion: {
            minimumInSeconds: 1,
            averageInSeconds: 2,
            maximumInSeconds: 3,
          },
          // Respective 1 sec diff
          stateUpdateDelays: {
            averageInSeconds: 1,
          },
          syncedUntil: new UnixTime(1000),
        },
        project2: {
          timeToInclusion: {
            minimumInSeconds: 4,
            averageInSeconds: 5,
            maximumInSeconds: 6,
          },
          stateUpdateDelays: {
            averageInSeconds: 0,
          },
          syncedUntil: new UnixTime(1000),
        },
        project3: {
          timeToInclusion: {
            minimumInSeconds: 7,
            averageInSeconds: 8,
            maximumInSeconds: 9,
          },
          stateUpdateDelays: null,
          syncedUntil: new UnixTime(12000),
        },
      })
    })
  })
})

function getMockFinalityRepository(records: FinalityRecord[]) {
  return mockObject<Database['finality']>({
    getLatestGroupedByProjectId: mockFn().resolvesTo(records),
    addMany() {
      return Promise.resolve(1)
    },
    deleteAll() {
      return Promise.resolve(1)
    },
  })
}

function getMockLivenessRepository(records: LivenessRecord[]) {
  return mockObject<Database['liveness']>({
    getByConfigurationIdSince(configurationIds: string[]) {
      return Promise.resolve(
        records
          .filter((x) => configurationIds.includes(x.configurationId))
          .sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber()),
      )
    },
    addMany() {
      return Promise.resolve(1)
    },
    deleteAll() {
      return Promise.resolve(1)
    },
  })
}

function mockProjectConfig(
  records: {
    projectId: ProjectId
    type: FinalityType
    lag: number
    stateUpdate: StateUpdateMode
  }[],
): FinalityProjectConfig[] {
  return records
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((project) =>
      mockObject<FinalityProjectConfig>({
        projectId: project.projectId,
        type: project.type,
        lag: project.lag,
        stateUpdate: project.stateUpdate,
      }),
    )
}
