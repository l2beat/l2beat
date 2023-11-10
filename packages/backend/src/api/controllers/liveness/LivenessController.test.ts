import { LivenessType, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import {
  LivenessRecordWithProjectIdAndType,
  LivenessRepository,
} from '../../../peripherals/database/LivenessRepository'
import {
  calculateAverage,
  calculateIntervals,
  calculateMax,
  filterRecords,
} from './calculateIntervalWithAverages'
import { LivenessController } from './LivenessController'

describe(LivenessController.name, () => {
  describe(LivenessController.prototype.getLiveness.name, () => {
    it('correctly finds anomalies', async () => {
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
      )

      const result = await livenessController.getLiveness()
      const project1Anomalies = result.projects.project1?.anomalies
      expect(project1Anomalies).toEqual([])
    })

    it('returns empty object if no data', async () => {
      const livenessController = new LivenessController(
        getMockLivenessRepository([]),
      )

      const result = await livenessController.getLiveness()
      expect(result).toEqual({ projects: {} })
    })

    it('correctly calculate avg and max', async () => {
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
      )

      const recordsWithIntervals = calculateIntervals(RECORDS)!

      const last30Days = filterRecords(recordsWithIntervals, '30d')
      const last90Days = filterRecords(recordsWithIntervals, '90d')
      const max = filterRecords(recordsWithIntervals, 'max')

      const expected = {
        last30Days: {
          averageInSeconds: calculateAverage(last30Days),
          maximumInSeconds: calculateMax(last30Days),
        },
        last90Days: {
          averageInSeconds: calculateAverage(last90Days),
          maximumInSeconds: calculateMax(last90Days),
        },
        max: {
          averageInSeconds: calculateAverage(max),
          maximumInSeconds: calculateMax(max),
        },
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
    addMany() {
      return Promise.resolve(1)
    },
    deleteAll() {
      return Promise.resolve(1)
    },
  })
}
