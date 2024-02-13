import { FinalityType } from '@l2beat/config'
import {
  assert,
  Hash256,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Project } from '../../../model/Project'
import { IndexerStateRepository } from '../../../peripherals/database/repositories/IndexerStateRepository'
import { Clock } from '../../../tools/Clock'
import {
  calculateDetailsFor,
  calculateIntervals,
} from '../../liveness/api/calculateIntervalWithAverages'
import {
  LivenessRecordWithProjectIdAndType,
  LivenessRepository,
} from '../../liveness/repositories/LivenessRepository'
import { FinalityController } from './FinalityController'

describe(FinalityController.name, () => {
  const CLOCK = getMockClock()
  describe(FinalityController.prototype.getFinality.name, () => {
    it('returns empty object if no data', async () => {
      const finalityController = new FinalityController(
        getMockLivenessRepository([]),
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
      const RECORDS: LivenessRecordWithProjectIdAndType[] = []

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
      const finalityController = new FinalityController(
        getMockLivenessRepository(RECORDS),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        mockProjectConfig(RECORDS),
        getMockClock(),
      )

      const records = [...RECORDS]
      calculateIntervals(records)
      const last30Days = calculateDetailsFor(records, '30d')

      assert(last30Days, 'last30Days is undefined')
      const expected = {
        averageInSeconds: last30Days.averageInSeconds / 2 + 0,
        maximumInSeconds: last30Days.maximumInSeconds,
      }

      const result = await finalityController.getFinality()
      if (result.type === 'success') {
        expect(result.data.projects.project1).toEqual(expected)
      }
    })

    it('return error when data is not fully synced', async () => {
      const clock = getMockClock()

      const outOfSyncTimestamp = CLOCK.getLastHour().add(-2, 'hours')
      const finalityController = new FinalityController(
        getMockLivenessRepository([]),
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
      const RECORDS: LivenessRecordWithProjectIdAndType[] = []

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
      const projects = mockProjectConfig(RECORDS)
      const finalityController = new FinalityController(
        getMockLivenessRepository(RECORDS),
        getMockIndexerStateRepository(CLOCK.getLastHour()),
        projects,
        getMockClock(),
      )

      const records = [...RECORDS]
      calculateIntervals(records)
      const last30Days = calculateDetailsFor(records, '30d')

      assert(last30Days, 'last30Days is undefined')
      const expected = {
        averageInSeconds: last30Days.averageInSeconds / 2 + 0,
        maximumInSeconds: last30Days.maximumInSeconds,
      }

      const result = await finalityController.getOPStackFinality(projects)
      expect(result.project1).toEqual(expected)
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

function getMockLivenessRepository(
  records: LivenessRecordWithProjectIdAndType[],
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
  records: LivenessRecordWithProjectIdAndType[],
  type: FinalityType = 'OPStack',
  lag = 0,
): Project[] {
  return records
    .map((x) => x.projectId)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((projectId) =>
      mockObject<Project>({
        projectId,
        isArchived: false,
        finalityConfig: mockObject<Project['finalityConfig']>({
          type,
          lag,
        }),
      }),
    )
}
