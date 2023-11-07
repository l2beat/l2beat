import { assert } from '@l2beat/backend-tools'
import { LivenessType, notUndefined, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, sum } from 'lodash'

import {
  LivenessRecordsWithIntervalAndDetails,
  LivenessRecordWithInterval,
} from './calculateIntervalWithAverages'

export function calculateAnomalies(
  projects: Dictionary<{
    batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
    stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
  }>,
) {
  const result: Dictionary<{
    batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
    stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
    anomalies: {
      timestamp: UnixTime
      durationInSeconds: number
      type: LivenessType
    }[]
  }> = {}
  for (const p in projects) {
    const batchSubmissions = projects[p].batchSubmissions
    const stateUpdates = projects[p].stateUpdates
    const anomalies: LivenessRecordWithInterval[] = []

    const NOW = UnixTime.now()

    if (batchSubmissions) {
      const batchSubmissionsLast30Days = batchSubmissions.records.filter(
        (record) => record.timestamp.gte(NOW.add(-30, 'days')),
      )
      batchSubmissionsLast30Days.forEach((record) => {
        if (record.previousRecordInterval === undefined) return
        const timeframe = record.timestamp.add(-30, 'days')
        const last30days = batchSubmissions.records.filter(
          (record) =>
            record.timestamp.gte(timeframe) &&
            record.timestamp.lte(record.timestamp),
        )
        const intervals = last30days
          .map((r) => r.previousRecordInterval)
          .filter(notUndefined)
        const avg = sum(intervals) / intervals.length
        const stdDev = standardDeviation(intervals, avg)
        const z = (record.previousRecordInterval - avg) / stdDev
        if (z >= 15) {
          anomalies.push(record)
        }
      })
    }

    if (stateUpdates) {
      const stateUpdatesLast30Days = stateUpdates.records.filter((record) =>
        record.timestamp.gte(NOW.add(-30, 'days')),
      )
      stateUpdatesLast30Days.forEach((record) => {
        if (record.previousRecordInterval === undefined) return
        const timeframe = record.timestamp.add(-30, 'days')
        const last30days = stateUpdates.records.filter(
          (record) =>
            record.timestamp.gte(timeframe) &&
            record.timestamp.lte(record.timestamp),
        )
        const intervals = last30days
          .map((r) => r.previousRecordInterval)
          .filter(notUndefined)
        const avg = sum(intervals) / intervals.length
        const stdDev = standardDeviation(intervals, avg)
        const z = (record.previousRecordInterval - avg) / stdDev
        if (z >= 15) {
          anomalies.push(record)
        }
      })
    }

    result[p] = {
      batchSubmissions: batchSubmissions,
      stateUpdates: stateUpdates,
      anomalies: anomalies.map((a) => {
        assert(
          a.previousRecordInterval !== undefined,
          'Programmer error: previousRecordInterval should not be undefined',
        )
        return {
          timestamp: a.timestamp,
          durationInSeconds: a.previousRecordInterval,
          type: a.type,
        }
      }),
    }
  }
  return result
}

function standardDeviation(array: number[], avg: number) {
  return Math.sqrt(sum(array.map((i) => Math.pow(i - avg, 2))) / array.length)
}
