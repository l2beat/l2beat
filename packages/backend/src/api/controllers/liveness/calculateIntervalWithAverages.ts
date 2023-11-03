import { notUndefined, UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'

export type LivenessRecordWithInterval = Omit<LivenessRecord, 'projectId'> & {
  previousRecordInterval?: number
}

export interface LivenessRecordsWithIntervalAndDetails<
  T = LivenessRecordWithInterval,
> {
  records: T[]
  last30days: {
    averageInSeconds: number | null
    maximumInSeconds: number | null
  }
  last90days: {
    averageInSeconds: number | null
    maximumInSeconds: number | null
  }
  max: {
    averageInSeconds: number | null
    maximumInSeconds: number | null
  }
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
    batchSubmissions: LivenessRecordsWithIntervalAndDetails
    stateUpdates: LivenessRecordsWithIntervalAndDetails
  }> = {}
  for (const project in records) {
    const projectRecords = records[project]
    result[project] = {
      batchSubmissions: {
        records: calculateIntervals(
          projectRecords.batchSubmissions.records.sort(
            (a, b) => b.timestamp.toNumber() - a.timestamp.toNumber(),
          ),
        ),
        last30days: {
          averageInSeconds: null,
          maximumInSeconds: null,
        },
        last90days: {
          averageInSeconds: null,
          maximumInSeconds: null,
        },
        max: {
          averageInSeconds: null,
          maximumInSeconds: null,
        },
      },

      stateUpdates: {
        records: calculateIntervals(
          projectRecords.stateUpdates.records.sort(
            (a, b) => b.timestamp.toNumber() - a.timestamp.toNumber(),
          ),
        ),
        last30days: {
          averageInSeconds: null,
          maximumInSeconds: null,
        },
        last90days: {
          averageInSeconds: null,
          maximumInSeconds: null,
        },
        max: {
          averageInSeconds: null,
          maximumInSeconds: null,
        },
      },
    }
    const averages = calculateAverages(result[project])
    result[project].batchSubmissions = {
      ...result[project].batchSubmissions,
      ...averages.batchSubmissions,
    }
    result[project].stateUpdates = {
      ...result[project].stateUpdates,
      ...averages.stateUpdates,
    }
  }
  return result
}

export function calculateIntervals(
  records: LivenessRecordWithInterval[],
): LivenessRecordWithInterval[] {
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

export function calculateAverages(record: {
  batchSubmissions: {
    records: LivenessRecordWithInterval[]
  }
  stateUpdates: {
    records: LivenessRecordWithInterval[]
  }
}) {
  const batchSubmissionsLast30Days = filterRecords(
    record.batchSubmissions.records,
    '30d',
  )
  const batchSubmissionsLast90Days = filterRecords(
    record.batchSubmissions.records,
    '90d',
  )
  const batchSubmissionsMax = filterRecords(
    record.batchSubmissions.records,
    'max',
  )

  const stateUpdatesLast30Days = filterRecords(
    record.stateUpdates.records,
    '30d',
  )
  const stateUpdatesLast90Days = filterRecords(
    record.stateUpdates.records,
    '90d',
  )
  const stateUpdatesMax = filterRecords(record.stateUpdates.records, 'max')

  return {
    batchSubmissions: {
      last30days: {
        averageInSeconds: calculateAverage(batchSubmissionsLast30Days),
        maximumInSeconds: calculateMax(batchSubmissionsLast30Days),
      },
      last90days: {
        averageInSeconds: calculateAverage(batchSubmissionsLast90Days),
        maximumInSeconds: calculateMax(batchSubmissionsLast90Days),
      },
      max: {
        averageInSeconds: calculateAverage(batchSubmissionsMax),
        maximumInSeconds: calculateMax(batchSubmissionsMax),
      },
    },
    stateUpdates: {
      last30days: {
        averageInSeconds: calculateAverage(stateUpdatesLast30Days),
        maximumInSeconds: calculateMax(stateUpdatesLast30Days),
      },
      last90days: {
        averageInSeconds: calculateAverage(stateUpdatesLast90Days),
        maximumInSeconds: calculateMax(stateUpdatesLast90Days),
      },
      max: {
        averageInSeconds: calculateAverage(stateUpdatesMax),
        maximumInSeconds: calculateMax(stateUpdatesMax),
      },
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
  return records.reduce((a, b) => a + b, 0) / records.length || null
}

export function calculateMax(records: number[]) {
  const max = Math.max(...records)
  if (max === -Infinity) {
    return null
  } else {
    return max
  }
}
