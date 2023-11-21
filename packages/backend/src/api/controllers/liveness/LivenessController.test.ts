import { assert, LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Project } from '../../../model'
import {
  LivenessRecordWithProjectIdAndType,
  LivenessRepository,
} from '../../../peripherals/database/LivenessRepository'
import {
  calculateDetailsFor,
  calculateIntervals,
} from './calculateIntervalWithAverages'
import { LivenessController } from './LivenessController'

describe(LivenessController.name, () => {
  describe(LivenessController.prototype.getLiveness.name, () => {
    // TODO: unskip it
    it.skip('correctly finds anomalies', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndType[] = []

      RECORDS.push(
        ...Array.from({ length: 500 }).map((_, i) => ({
          projectId: ProjectId('project1'),
          timestamp: START.add(-i, 'hours'),
          type: LivenessType('DA'),
        })),
      )
      RECORDS.push({
        projectId: ProjectId('project1'),
        timestamp: START.add(-1000, 'hours'),
        type: LivenessType('DA'),
      })

      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockProjectConfig(RECORDS),
      )

      const result = await livenessController.getLiveness()
      const project1Anomalies = result.projects.project1?.anomalies

      expect(project1Anomalies).toEqual([
        {
          timestamp: RECORDS.at(-2)!.timestamp,
          durationInSeconds: 501 * 3600,
          type: LivenessType('DA'),
        },
      ])
    })

    it('returns empty array if no anomalies', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndType[] = []

      RECORDS.push(
        ...Array.from({ length: 10 }).map((_, i) => ({
          projectId: ProjectId('project1'),
          timestamp: START.add(-i, 'hours'),
          type: LivenessType('DA'),
        })),
      )
      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockProjectConfig(RECORDS),
      )

      const result = await livenessController.getLiveness()
      const project1Anomalies = result.projects.project1?.anomalies
      expect(project1Anomalies).toEqual([])
    })

    it('returns empty object if no data', async () => {
      const livenessController = new LivenessController(
        getMockLivenessRepository([]),
        [],
      )

      const result = await livenessController.getLiveness()
      expect(result).toEqual({ projects: {} })
    })

    it('correctly calculate avg, min and max', async () => {
      const RECORDS: LivenessRecordWithProjectIdAndType[] = []

      RECORDS.push(
        ...Array.from({ length: 30 + 60 / 2 + 30 / 3 }).map((_, i) => {
          let daysToAdd = 0
          if (i < 30) {
            daysToAdd = i
          } else if (i < 30 + 60 / 2) {
            daysToAdd = 30 + (i - 30) * 2
          } else {
            daysToAdd = 30 + 60 + (i - (30 + 60 / 2)) * 3
          }

          return {
            projectId: ProjectId('project1'),
            timestamp: START.add(-daysToAdd, 'days'),
            type: LivenessType('DA'),
          }
        }),
      )
      const livenessController = new LivenessController(
        getMockLivenessRepository(RECORDS),
        mockProjectConfig(RECORDS),
      )

      const records = [...RECORDS]
      calculateIntervals(records)

      const last30Days = calculateDetailsFor(records, '30d')
      const last90Days = calculateDetailsFor(records, '90d')
      const allTime = calculateDetailsFor(records, 'allTime')

      assert(last30Days, 'last30Days is undefined')
      assert(last90Days, 'last90Days is undefined')
      assert(allTime, 'allTime is undefined')

      const expected = {
        last30Days,
        last90Days,
        allTime,
      }

      const result = await livenessController.getLiveness()
      const project1BatchSubmissions =
        result.projects.project1?.batchSubmissions
      expect(project1BatchSubmissions).toEqual(expected)
    })
  })
})

const START = UnixTime.now()

function getMockLivenessRepository(
  records: LivenessRecordWithProjectIdAndType[],
) {
  return mockObject<LivenessRepository>({
    getAllWithProjectIdAndType() {
      return Promise.resolve(records)
    },
    getWithType(projectId: ProjectId) {
      return Promise.resolve(records.filter((x) => x.projectId === projectId))
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
): Project[] {
  return records
    .map((x) => x.projectId)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((projectId) =>
      mockObject<Project>({
        projectId,
        livenessConfig: mockObject<Project['livenessConfig']>(),
      }),
    )
}
