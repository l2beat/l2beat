import { FinalityType } from '@l2beat/config'
import {
  assert,
  Hash256,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { FinalityProjectConfig } from '../../../config/features/finality'
import { IndexerStateRepository } from '../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../tools/Clock'
import {
  calculateDetailsFor,
  calculateIntervals,
} from '../../liveness/api/calculateIntervalWithAverages'
import {
  LivenessRecordWithProjectIdAndSubtype,
  LivenessRepository,
} from '../../liveness/repositories/LivenessRepository'
import {
  FinalityRecord,
  FinalityRepository,
} from '../repositories/FinalityRepository'
import { FinalityController } from './FinalityController'

describe(FinalityController.name, () => {
  const CLOCK = getMockClock()
  describe(FinalityController.prototype.getFinality.name, () => {
    it('returns empty object if no data', async () => {
      const finalityController = new FinalityController(
        getMockLivenessRepository([]),
        getMockFinalityRepository(),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        [],
        CLOCK,
      )

      const result = await finalityController.getFinality()
      if (result.type === 'success') {
        expect(result.data).toEqual({ projects: {} })
      }
    })

    it('correctly calculate avg, min and max', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndSubtype[] = []

      RECORDS.push(
        ...Array.from({ length: 5 }).map((_, i) => {
          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-i, 'days'),
            type: LivenessType('DA'),
          }
        }),
      )
      RECORDS.push(
        ...Array.from({ length: 3 }).map((_, i) => {
          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-(5 + i * 2), 'days'),
            type: LivenessType('DA'),
          }
        }),
      )
      const project2Result = {
        projectId: ProjectId('project2'),
        timestamp: new UnixTime(1000),
        minimumTimeToInclusion: 1,
        averageTimeToInclusion: 2,
        maximumTimeToInclusion: 3,
      }
      const finalityController = new FinalityController(
        getMockLivenessRepository(RECORDS),
        getMockFinalityRepository([project2Result]),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        mockProjectConfig([
          {
            projectId: ProjectId('project1'),
            lag: 0,
            type: 'OPStack',
          },
          {
            projectId: ProjectId('project2'),
            lag: 0,
            type: 'Linea',
          },
        ]),
        getMockClock(),
      )

      const records = [...RECORDS]
      calculateIntervals(records)
      const last30Days = calculateDetailsFor(records, '30d')

      assert(last30Days, 'last30Days is undefined')
      const result = await finalityController.getFinality()
      if (result.type === 'success') {
        expect(result.data.projects.project1).toEqual({
          timeToInclusion: {
            averageInSeconds: last30Days.averageInSeconds / 2 + 0,
            maximumInSeconds: last30Days.maximumInSeconds,
          },
          syncedUntil: records[0].timestamp,
        })
        expect(result.data.projects.project2).toEqual({
          timeToInclusion: {
            averageInSeconds: project2Result.averageTimeToInclusion,
            maximumInSeconds: project2Result.maximumTimeToInclusion,
            minimumInSeconds: project2Result.minimumTimeToInclusion,
          },
          syncedUntil: project2Result.timestamp,
        })
      }
    })

    it('return error when data is not fully synced', async () => {
      const clock = getMockClock()

      const outOfSyncTimestamp = CLOCK.getLastHour().add(-2, 'hours')
      const finalityController = new FinalityController(
        getMockLivenessRepository([]),
        getMockFinalityRepository(),
        getMockIndexerStateRepository(outOfSyncTimestamp),
        mockProjectConfig([]),
        clock,
      )
      const result = await finalityController.getFinality()

      expect(result.type).toEqual('error')
      if (result.type === 'error') {
        expect(result.error).toEqual('DATA_NOT_SYNCED')
      }
    })
  })

  describe(FinalityController.prototype.getOPStackFinality.name, () => {
    it('correctly calculate avg, min and max', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndSubtype[] = []

      RECORDS.push(
        ...Array.from({ length: 5 }).map((_, i) => {
          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-i, 'days'),
            type: LivenessType('DA'),
          }
        }),
      )
      RECORDS.push(
        ...Array.from({ length: 3 }).map((_, i) => {
          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-(5 + i * 2), 'days'),
            type: LivenessType('DA'),
          }
        }),
      )
      const projects = mockProjectConfig([
        { projectId: ProjectId('project1'), lag: 0, type: 'OPStack' },
      ])
      const finalityController = new FinalityController(
        getMockLivenessRepository(RECORDS),
        getMockFinalityRepository(),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        projects,
        getMockClock(),
      )

      const records = [...RECORDS]
      calculateIntervals(records)
      const last30Days = calculateDetailsFor(records, '30d')

      assert(last30Days, 'last30Days is undefined')

      const result = await finalityController.getOPStackFinality(projects)
      expect(result.project1).toEqual({
        timeToInclusion: {
          averageInSeconds: last30Days.averageInSeconds / 2 + 0,
          maximumInSeconds: last30Days.maximumInSeconds,
        },
        syncedUntil: records[0].timestamp,
      })
    })
  })

  describe(FinalityController.prototype.getProjectsFinality.name, () => {
    it('gets finality records for all projects with one undefined', async () => {
      const projects = mockProjectConfig([
        { projectId: ProjectId('project1'), lag: 0, type: 'Linea' },
        { projectId: ProjectId('project2'), lag: 0, type: 'Linea' },
        { projectId: ProjectId('project3'), lag: 0, type: 'Linea' },
      ])
      const finalityController = new FinalityController(
        getMockLivenessRepository([]),
        getMockFinalityRepository([
          {
            projectId: ProjectId('project1'),
            timestamp: new UnixTime(1000),
            minimumTimeToInclusion: 1,
            averageTimeToInclusion: 2,
            maximumTimeToInclusion: 3,
          },
          {
            projectId: ProjectId('project3'),
            timestamp: new UnixTime(12000),
            minimumTimeToInclusion: 4,
            averageTimeToInclusion: 5,
            maximumTimeToInclusion: 6,
          },
        ]),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        projects,
        getMockClock(),
      )

      const result = await finalityController.getProjectsFinality(projects)
      expect(result).toEqual({
        project1: {
          timeToInclusion: {
            minimumInSeconds: 1,
            averageInSeconds: 2,
            maximumInSeconds: 3,
          },
          syncedUntil: new UnixTime(1000),
        },
        project3: {
          timeToInclusion: {
            minimumInSeconds: 4,
            averageInSeconds: 5,
            maximumInSeconds: 6,
          },
          syncedUntil: new UnixTime(12000),
        },
      })
    })
  })
})

const START = UnixTime.now()

function getMockClock() {
  return mockObject<Clock>({
    getLastHour: () => UnixTime.now().toStartOf('hour').add(-1, 'hours'),
  })
}

function getMockIndexerStateRepository(data: UnixTime) {
  return mockObject<IndexerStateRepository>({
    findIndexerState: async () => {
      return {
        id: 1,
        configHash: Hash256.random(),
        indexerId: 'liveness_indexer',
        safeHeight: data.toNumber(),
      }
    },
  })
}

function getMockFinalityRepository(records: FinalityRecord[] = []) {
  return mockObject<FinalityRepository>({
    getLatestGroupedByProjectId: mockFn().resolvesTo(records),
    addMany() {
      return Promise.resolve(1)
    },
    deleteAll() {
      return Promise.resolve(1)
    },
  })
}

function getMockLivenessRepository(
  records: LivenessRecordWithProjectIdAndSubtype[],
) {
  return mockObject<LivenessRepository>({
    getByProjectIdAndType(projectId: ProjectId) {
      return Promise.resolve(
        records
          .filter((x) => x.projectId === projectId)
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
  }[],
): FinalityProjectConfig[] {
  return records
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((project) =>
      mockObject<FinalityProjectConfig>({
        projectId: project.projectId,
        type: project.type,
        lag: project.lag,
      }),
    )
}
