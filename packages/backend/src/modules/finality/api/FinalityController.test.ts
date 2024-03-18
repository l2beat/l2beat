import { FinalityType } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { range } from 'lodash'

import { FinalityProjectConfig } from '../../../config/features/finality'
import {
  calculateDetailsFor,
  calculateIntervals,
} from '../../tracked-txs/modules/liveness/api/calculateIntervalWithAverages'
import {
  LivenessRecordWithProjectIdAndSubtype,
  LivenessRepository,
} from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { TrackedTxsConfigsRepository } from '../../tracked-txs/repositories/TrackedTxsConfigsRepository'
import {
  FinalityRecord,
  FinalityRepository,
} from '../repositories/FinalityRepository'
import { FinalityController } from './FinalityController'

describe(FinalityController.name, () => {
  describe(FinalityController.prototype.getFinality.name, () => {
    it('returns empty object if no data', async () => {
      const finalityController = new FinalityController(
        getMockLivenessRepository([]),
        getMockFinalityRepository([]),
        mockObject<TrackedTxsConfigsRepository>(),
        [],
      )

      const result = await finalityController.getFinality()
      if (result.type === 'success') {
        expect(result.data).toEqual({ projects: {} })
      }
    })

    it('correctly calculate avg, min and max', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndSubtype[] = [
        ...range(5).map((_, i) => {
          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-i, 'days'),
            subtype: 'batchSubmissions',
          } as const
        }),
        ...range(3).map((_, i) => {
          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-(5 + i * 2), 'days'),
            subtype: 'batchSubmissions',
          } as const
        }),
      ]

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
        mockObject<TrackedTxsConfigsRepository>({
          findLatestSyncedTimestampByProjectIdAndSubtype: mockFn()
            .given(ProjectId('project1'), 'batchSubmissions')
            .resolvesToOnce(START),
        }),
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
  })

  describe(FinalityController.prototype.getOPStackFinality.name, () => {
    it('correctly calculate avg, min and max', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndSubtype[] = [
        ...range(5).map((_, i) => {
          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-i, 'days'),
            subtype: 'batchSubmissions',
          } as const
        }),
        ...range(3).map((_, i) => {
          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-(5 + i * 2), 'days'),
            subtype: 'batchSubmissions',
          } as const
        }),
        ...range(5).map((_, i) => {
          return {
            projectId: ProjectId('project2'),
            timestamp: START.add(-i, 'days'),
            subtype: 'batchSubmissions',
          } as const
        }),
        ...range(3).map((_, i) => {
          return {
            projectId: ProjectId('project2'),
            timestamp: START.add(-(5 + i * 2), 'days'),
            subtype: 'batchSubmissions',
          } as const
        }),
      ]

      const projects = mockProjectConfig([
        { projectId: ProjectId('project1'), lag: 0, type: 'OPStack' },
      ])
      const finalityController = new FinalityController(
        getMockLivenessRepository(RECORDS),
        getMockFinalityRepository([]),
        mockObject<TrackedTxsConfigsRepository>({
          findLatestSyncedTimestampByProjectIdAndSubtype: mockFn()
            .given(ProjectId('project1'), 'batchSubmissions')
            .resolvesToOnce(START)
            .given(ProjectId('project2'), 'batchSubmissions')
            .resolvesToOnce(undefined),
        }),
        projects,
      )

      const project1Records = RECORDS.filter(
        (r) => r.projectId === ProjectId('project1'),
      )
      calculateIntervals(project1Records)
      const project1Last30Days = calculateDetailsFor(project1Records, '30d')

      assert(project1Last30Days, 'last30Days is undefined')

      const result = await finalityController.getOPStackFinality(projects)
      expect(result).toEqual({
        project1: {
          timeToInclusion: {
            averageInSeconds: project1Last30Days.averageInSeconds / 2 + 0,
            maximumInSeconds: project1Last30Days.maximumInSeconds,
          },
          syncedUntil: START,
        },
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
        mockObject<TrackedTxsConfigsRepository>(),
        projects,
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

function getMockFinalityRepository(records: FinalityRecord[]) {
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
