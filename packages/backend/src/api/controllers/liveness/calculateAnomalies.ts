import { assert } from '@l2beat/backend-tools'
import {
  LivenessAnomaly,
  LivenessApiResponse,
  notUndefined,
  UnixTime,
} from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'

import {
  LivenessRecordsWithIntervalAndDetails,
  LivenessRecordWithInterval,
} from './calculateIntervalWithAverages'
import { RunningStatistics } from './RollingVariance'

export function calculateAnomalies(
  projects: Dictionary<{
    batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
    stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
  }>,
): LivenessApiResponse {
  const result: LivenessApiResponse['projects'] = {}
  for (const p in projects) {
    result[p] = calculateAnomaliesPerProject(projects[p])
  }
  return { projects: result }
}

export function calculateAnomaliesPerProject({
  batchSubmissions,
  stateUpdates,
}: {
  batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
  stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
}): LivenessApiResponse['projects'][number] {
  const lastHour = UnixTime.now().toStartOf('hour')

  let batchSubmissionAnomalies: LivenessAnomaly[] | undefined = undefined
  if (batchSubmissions) {
    const anomalies = findAnomalies(batchSubmissions.records, lastHour)
    if (anomalies) {
      batchSubmissionAnomalies = anomalies
    }
  }

  let stateUpdatesAnomalies: LivenessAnomaly[] | undefined = undefined
  if (stateUpdates) {
    const anomalies = findAnomalies(stateUpdates.records, lastHour)
    if (anomalies) {
      stateUpdatesAnomalies = anomalies
    }
  }

  let anomalies: LivenessAnomaly[] | undefined = undefined

  if (batchSubmissionAnomalies || stateUpdatesAnomalies) {
    anomalies = []
    if (batchSubmissionAnomalies) {
      anomalies = anomalies.concat(batchSubmissionAnomalies)
    }
    if (stateUpdatesAnomalies) {
      anomalies = anomalies.concat(stateUpdatesAnomalies)
    }
  }

  return {
    batchSubmissions: {
      last30Days: batchSubmissions?.last30Days,
      last90Days: batchSubmissions?.last90Days,
      max: batchSubmissions?.max,
    },
    stateUpdates: {
      last30Days: stateUpdates?.last30Days,
      last90Days: stateUpdates?.last90Days,
      max: stateUpdates?.max,
    },
    anomalies,
  }
}

/**
 *
 * @param records sorted array of records, newest first
 * @param lastHour last full hour
 * @returns anomalies array
 */
function findAnomalies(
  records: LivenessRecordWithInterval[],
  lastHour: UnixTime,
): LivenessAnomaly[] | undefined {
  const lastRecord = records.at(-1)
  if (lastRecord === undefined) return []
  if (lastRecord.timestamp.gt(lastHour.add(-60, 'days'))) return []

  const timestamp60daysAgo = lastHour.add(-60, 'days')
  const last60Days = records.filter((record) =>
    record.timestamp.gte(timestamp60daysAgo),
  )
  if (last60Days.length === 0) return undefined

  const means = new Map<number, number>()
  const stdDevs = new Map<number, number>()

  let timeStart = lastHour
  let startIndex = last60Days.findIndex((record) =>
    record.timestamp.lte(lastHour),
  )
  let lastIndex = last60Days.findIndex((record) =>
    record.timestamp.lte(lastHour.add(-30, 'days')),
  )

  const last30Days = last60Days.slice(startIndex, lastIndex)
  let sum = last30Days.reduce(
    (prev, curr) => prev + (curr.previousRecordInterval ?? 0),
    0,
  )

  // special handling for the first loop iteration
  const mean = sum / (lastIndex - startIndex)
  const rollingStdDev = new RunningStatistics(
    last30Days.map((r) => r.previousRecordInterval).filter(notUndefined),
  )

  means.set(timeStart.toNumber(), mean)
  stdDevs.set(timeStart.toNumber(), rollingStdDev.getStandardDeviation())
  while (timeStart.gte(lastHour.add(-30, 'days'))) {
    timeStart = timeStart.add(-1, 'minutes')
    const leftFence = timeStart
    const rightFence = timeStart.add(-30, 'days')

    while (last60Days[startIndex].timestamp.gte(leftFence)) {
      sum -= last60Days[startIndex].previousRecordInterval ?? 0
      rollingStdDev.removeValue(
        last60Days[startIndex].previousRecordInterval ?? 0,
      )
      startIndex++
    }
    while (
      lastIndex < last60Days.length &&
      last60Days[lastIndex].timestamp.gte(rightFence)
    ) {
      sum += last60Days[lastIndex].previousRecordInterval ?? 0
      rollingStdDev.addValue(last60Days[lastIndex].previousRecordInterval ?? 0)
      lastIndex++
    }

    const mean = sum / (lastIndex - startIndex)
    means.set(timeStart.toNumber(), mean)
    stdDevs.set(timeStart.toNumber(), rollingStdDev.getStandardDeviation())
  }

  const anomalies: LivenessAnomaly[] = []
  last30Days.forEach((record) => {
    if (record.previousRecordInterval === undefined) return

    const mean = means.get(record.timestamp.toStartOf('minute').toNumber())
    const stdDev = stdDevs.get(record.timestamp.toStartOf('minute').toNumber())
    assert(mean !== undefined, 'mean should not be undefined')
    assert(stdDev !== undefined, 'stdDev should not be undefined')

    const z = (record.previousRecordInterval - mean) / stdDev
    if (z >= 15 && record.previousRecordInterval > mean) {
      anomalies.push({
        timestamp: record.timestamp,
        durationInSeconds: record.previousRecordInterval,
        type: record.type,
      })
    }
  })
  return anomalies
}
