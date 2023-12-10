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
    proofSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
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
  proofSubmissions,
}: {
  batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
  stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
  proofSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
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

  let proofSubmissionsAnomalies: LivenessAnomaly[] | undefined = undefined
  if (proofSubmissions) {
    const anomalies = findAnomalies(proofSubmissions.records, lastHour)
    if (anomalies) {
      proofSubmissionsAnomalies = anomalies
    }
  }

  let anomalies: LivenessAnomaly[] | undefined = undefined

  if (
    batchSubmissionAnomalies ||
    stateUpdatesAnomalies ||
    proofSubmissionsAnomalies
  ) {
    anomalies = []
    if (batchSubmissionAnomalies) {
      anomalies = anomalies.concat(batchSubmissionAnomalies)
    }
    if (stateUpdatesAnomalies) {
      anomalies = anomalies.concat(stateUpdatesAnomalies)
    }
    if (proofSubmissionsAnomalies) {
      anomalies = anomalies.concat(proofSubmissionsAnomalies)
    }
  }

  return {
    batchSubmissions: {
      last30Days: batchSubmissions?.last30Days,
      last90Days: batchSubmissions?.last90Days,
      allTime: batchSubmissions?.allTime,
    },
    stateUpdates: {
      last30Days: stateUpdates?.last30Days,
      last90Days: stateUpdates?.last90Days,
      allTime: stateUpdates?.allTime,
    },
    proofSubmissions: {
      last30Days: proofSubmissions?.last30Days,
      last90Days: proofSubmissions?.last90Days,
      allTime: proofSubmissions?.allTime,
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

  const startIndex = last60Days.findIndex((record) =>
    record.timestamp.lte(lastHour),
  )
  const lastIndex = last60Days.findIndex((record) =>
    record.timestamp.lte(lastHour.add(-30, 'days')),
  )

  const { means, stdDevs } = calculate30DayRollingStats(
    last60Days,
    startIndex,
    lastIndex,
    lastHour,
  )
  const anomalies: LivenessAnomaly[] = []
  const last30Days = last60Days.slice(startIndex, lastIndex)
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

// TODO(radomski): Make this more generic, the only thing to figure out is how to pass the time intervals.
// Remember to enforce the fact that if you have a rolling sum that takes into consideration the last 30 days you need to pass to this function the last 60 days.
// So for any rolling window of n days you need to ensure that the entireScope is at least 2n days.
export function calculate30DayRollingStats(
  entireScope: LivenessRecordWithInterval[],
  windowStartIndex: number,
  windowEndIndex: number,
  lastHour: UnixTime,
): {
  means: Map<number, number>
  stdDevs: Map<number, number>
} {
  const result = {
    means: new Map<number, number>(),
    stdDevs: new Map<number, number>(),
  }

  let timeStart = lastHour

  const initialWindow = entireScope.slice(windowStartIndex, windowEndIndex)
  let sum = initialWindow.reduce(
    (prev, curr) => prev + (curr.previousRecordInterval ?? 0),
    0,
  )

  // special handling for the first loop iteration
  const mean = sum / (windowEndIndex - windowStartIndex)
  const rollingStdDev = new RunningStatistics(
    initialWindow.map((r) => r.previousRecordInterval).filter(notUndefined),
  )

  result.means.set(timeStart.toNumber(), mean)
  result.stdDevs.set(timeStart.toNumber(), rollingStdDev.getStandardDeviation())
  while (timeStart.gte(lastHour.add(-30, 'days'))) {
    timeStart = timeStart.add(-1, 'minutes')
    const leftFence = timeStart
    const rightFence = timeStart.add(-30, 'days')

    while (entireScope[windowStartIndex].timestamp.gte(leftFence)) {
      sum -= entireScope[windowStartIndex].previousRecordInterval ?? 0
      rollingStdDev.removeValue(
        entireScope[windowStartIndex].previousRecordInterval ?? 0,
      )
      windowStartIndex++
    }
    while (
      windowEndIndex < entireScope.length &&
      entireScope[windowEndIndex].timestamp.gte(rightFence)
    ) {
      sum += entireScope[windowEndIndex].previousRecordInterval ?? 0
      rollingStdDev.addValue(
        entireScope[windowEndIndex].previousRecordInterval ?? 0,
      )
      windowEndIndex++
    }

    const mean = sum / (windowEndIndex - windowStartIndex)
    result.means.set(timeStart.toNumber(), mean)
    result.stdDevs.set(
      timeStart.toNumber(),
      rollingStdDev.getStandardDeviation(),
    )
  }

  return result
}
