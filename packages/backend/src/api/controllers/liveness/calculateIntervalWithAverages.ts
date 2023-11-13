import { UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'

import { LivenessRecordWithProjectIdAndType } from '../../../peripherals/database/LivenessRepository'

export type LivenessRecordWithInterval = Omit<
  LivenessRecordWithProjectIdAndType,
  'projectId'
> & {
  previousRecordInterval?: number
}
interface AvgAndMax {
  averageInSeconds: number
  maximumInSeconds: number
}

//
//
//
//
//
//
// WARNING(radomski): This is performance sensitive code, please think twice
// about changing anything inside it. Everything that seems to be bad practice,
// risky or just wrong is intended to be here. Any uninformed changes to this
// code could result in breaking production!
//
//
//
//
//
//

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
        records: Omit<LivenessRecordWithProjectIdAndType, 'projectId'>[]
      }
      stateUpdates: {
        records: Omit<LivenessRecordWithProjectIdAndType, 'projectId'>[]
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

    calculateIntervals(projectRecords.batchSubmissions.records)
    const batchSubmissionsWithIntervals =
      projectRecords.batchSubmissions.records

    calculateIntervals(projectRecords.stateUpdates.records)
    const stateUpdatesWithIntervals = projectRecords.stateUpdates.records

    result[project] = {
      batchSubmissions: calculateDetailedAverages(
        batchSubmissionsWithIntervals,
      ),
      stateUpdates: calculateDetailedAverages(stateUpdatesWithIntervals),
    }
  }
  return result
}

function calculateDetailedAverages(
  intervals: LivenessRecordWithInterval[] | undefined,
): LivenessRecordsWithIntervalAndDetails | undefined {
  if (!intervals || intervals.length <= 1) {
    return undefined
  }

  const averages = calculateAverages(intervals)
  return {
    records: intervals,
    last30Days: averages.last30Days,
    last90Days: averages.last90Days,
    max: averages.max,
  }
}

export function calculateIntervals(
  records: LivenessRecordWithInterval[],
): void {
  for (let i = 0; i < records.length - 1; i++) {
    records[i].previousRecordInterval =
      records[i].timestamp.toNumber() - records[i + 1].timestamp.toNumber()
  }
}

export function calculateAverages(records: LivenessRecordWithInterval[]) {
  const last30Days = calculateDetailsFor(records, '30d')
  const last90Days = calculateDetailsFor(records, '90d')
  const max = calculateDetailsFor(records, 'max')

  return {
    last30Days:
      last30Days === undefined
        ? undefined
        : {
            averageInSeconds: last30Days.averageInSeconds,
            maximumInSeconds: last30Days.maximumInSeconds,
          },
    last90Days:
      last90Days === undefined
        ? undefined
        : {
            averageInSeconds: last90Days.averageInSeconds,
            maximumInSeconds: last90Days.maximumInSeconds,
          },
    max:
      max === undefined
        ? undefined
        : {
            averageInSeconds: max.averageInSeconds,
            maximumInSeconds: max.maximumInSeconds,
          },
  }
}

export function calculateDetailsFor(
  records: readonly LivenessRecordWithInterval[],
  type: '30d' | '60d' | '90d' | 'max',
):
  | {
      averageInSeconds: number
      maximumInSeconds: number
    }
  | undefined {
  if (type === 'max') {
    if (records.length === 0) {
      return undefined
    }
    const result = { averageInSeconds: 0, maximumInSeconds: 0 }
    for (const record of records.slice(0, records.length - 1)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.averageInSeconds += record.previousRecordInterval!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.maximumInSeconds = Math.max(
        result.maximumInSeconds,
        record.previousRecordInterval!,
      )
    }
    result.averageInSeconds = Math.ceil(
      result.averageInSeconds / (records.length - 1),
    )
    return result
  } else {
    const NOW = UnixTime.now()
    const timeframe = type === '30d' ? -30 : type === '60d' ? -60 : -90
    const lastIndex = records.findIndex((record) =>
      record.timestamp.lte(NOW.add(timeframe, 'days')),
    )
    const filtered = records.slice(0, lastIndex)
    if (filtered.length === 0) {
      return undefined
    }
    const result = { averageInSeconds: 0, maximumInSeconds: 0 }
    for (const record of filtered) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.averageInSeconds += record.previousRecordInterval!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.maximumInSeconds = Math.max(
        result.maximumInSeconds,
        record.previousRecordInterval!,
      )
    }
    result.averageInSeconds = Math.ceil(
      result.averageInSeconds / filtered.length,
    )
    return result
  }
}
