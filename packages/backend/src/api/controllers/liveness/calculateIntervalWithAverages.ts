import { notUndefined, UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'

export type LivenessRecordWithInterval = Omit<LivenessRecord, 'projectId'> & {
  previousRecordInterval?: number
}
interface AvgAndMax {
  averageInSeconds: number
  maximumInSeconds: number
}

export interface LivenessRecordsWithIntervalAndDetails<
  T = LivenessRecordWithInterval,
> {
  records: T[]
  last30Days: AvgAndMax | undefined
  last90Days: AvgAndMax | undefined
  max: AvgAndMax | undefined
}

export function calculateIntervalWithAverages(
  records: Record<
    string,
    {
      batchSubmissions: {
        records: Omit<LivenessRecord, 'projectId'>[]
      }
      stateUpdates: {
        records: Omit<LivenessRecord, 'projectId'>[]
      }
    }
  >,
) {
  const result: Dictionary<{
    batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
    stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
  }> = {}
  for (const project in records) {
    const projectRecords = records[project]
    const batchSubmissionsWithIntervals = calculateIntervals(
      projectRecords.batchSubmissions.records,
    )
    const stateUpdatesWithIntervals = calculateIntervals(
      projectRecords.stateUpdates.records,
    )

    result[project] = {
      batchSubmissions: !batchSubmissionsWithIntervals
        ? undefined
        : {
            records: batchSubmissionsWithIntervals,
            last30Days: calculateAverages(batchSubmissionsWithIntervals)
              .last30Days,
            last90Days: calculateAverages(batchSubmissionsWithIntervals)
              .last90Days,
            max: calculateAverages(batchSubmissionsWithIntervals).max,
          },
      stateUpdates: !stateUpdatesWithIntervals
        ? undefined
        : {
            records: stateUpdatesWithIntervals,
            last30Days: calculateAverages(stateUpdatesWithIntervals).last30Days,
            last90Days: calculateAverages(stateUpdatesWithIntervals).last90Days,
            max: calculateAverages(stateUpdatesWithIntervals).max,
          },
    }
  }
  return result
}

export function calculateIntervals(
  records: LivenessRecordWithInterval[],
): LivenessRecordWithInterval[] | undefined {
  if (records.length === 0) {
    return undefined
  }
  records.forEach((record, index) => {
    if (index === records.length - 1) {
      return
    }
    const nextRecord = records[index + 1]
    record.previousRecordInterval =
      record.timestamp.toNumber() - nextRecord.timestamp.toNumber()
  })
  return records
}

export function calculateAverages(records: LivenessRecordWithInterval[]) {
  const last30Days = filterRecords(records, '30d')
  const last90Days = filterRecords(records, '90d')
  const max = filterRecords(records, 'max')

  return {
    last30Days: !last30Days.length
      ? undefined
      : {
          averageInSeconds: calculateAverage(last30Days),
          maximumInSeconds: calculateMax(last30Days),
        },
    last90Days: !last90Days.length
      ? undefined
      : {
          averageInSeconds: calculateAverage(last90Days),
          maximumInSeconds: calculateMax(last90Days),
        },
    max: !max.length
      ? undefined
      : {
          averageInSeconds: calculateAverage(max),
          maximumInSeconds: calculateMax(max),
        },
  }
}

export function filterRecords(
  records: LivenessRecordWithInterval[],
  type: '30d' | '60d' | '90d' | 'max',
) {
  if (type === 'max') {
    return records
      .map((record) => record.previousRecordInterval)
      .filter(notUndefined)
  } else {
    const NOW = UnixTime.now()
    const timeframe = type === '30d' ? -30 : type === '60d' ? -60 : -90
    return records
      .filter((record) => record.timestamp.gte(NOW.add(timeframe, 'days')))
      .map((record) => record.previousRecordInterval)
      .filter(notUndefined)
  }
}

export function calculateAverage(records: number[]) {
  return records.reduce((a, b) => a + b, 0) / records.length
}

export function calculateMax(records: number[]) {
  return Math.max(...records)
}
