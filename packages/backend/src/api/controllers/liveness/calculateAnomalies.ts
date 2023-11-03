import { notUndefined, UnixTime } from '@l2beat/shared-pure'
import { Dictionary, sum } from 'lodash'

import {
  LivenessRecordsWithIntervalAndDetails,
  LivenessRecordWithInterval,
} from './calculateIntervalWithAverages'

export function calculateAnomalies(
  projects: Dictionary<{
    batchSubmissions: LivenessRecordsWithIntervalAndDetails
    stateUpdates: LivenessRecordsWithIntervalAndDetails
  }>,
) {
  const result: Dictionary<{
    batchSubmissions: LivenessRecordsWithIntervalAndDetails<
      LivenessRecordWithInterval & {
        isAnomaly?: boolean
      }
    >
    stateUpdates: LivenessRecordsWithIntervalAndDetails<
      LivenessRecordWithInterval & {
        isAnomaly?: boolean
      }
    >
    anomalies: (LivenessRecordWithInterval & {
      isAnomaly?: boolean
    })[]
  }> = {}
  for (const p in projects) {
    result[p] = {
      batchSubmissions: {
        ...projects[p].batchSubmissions,
      },
      stateUpdates: {
        ...projects[p].stateUpdates,
      },
      anomalies: [],
    }
    const NOW = UnixTime.now()
    const batchSubmissionsLast30Days = result[
      p
    ].batchSubmissions.records.filter((record) =>
      record.timestamp.gte(NOW.add(-30, 'days')),
    )
    const stateUpdatesLast30Days = result[p].stateUpdates.records.filter(
      (record) => record.timestamp.gte(NOW.add(-30, 'days')),
    )

    batchSubmissionsLast30Days.forEach((record, i) => {
      if (record.previousRecordInterval === undefined) return
      const timeframe = record.timestamp.add(-30, 'days')
      const last30days = result[p].batchSubmissions.records.filter(
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
        result[p].batchSubmissions.records[i].isAnomaly = true
      }
    })
    stateUpdatesLast30Days.forEach((record, i) => {
      if (record.previousRecordInterval === undefined) return
      const timeframe = record.timestamp.add(-30, 'days')
      const last30days = result[p].stateUpdates.records.filter(
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
        result[p].stateUpdates.records[i].isAnomaly = true
      }
    })
    const anomalies = [
      ...result[p].batchSubmissions.records.filter((r) => r.isAnomaly),
      ...result[p].stateUpdates.records.filter((r) => r.isAnomaly),
    ]
    result[p].anomalies.push(...anomalies)
  }
  return result
}

function standardDeviation(array: number[], avg: number) {
  return Math.sqrt(sum(array.map((i) => Math.pow(i - avg, 2))) / array.length)
}
