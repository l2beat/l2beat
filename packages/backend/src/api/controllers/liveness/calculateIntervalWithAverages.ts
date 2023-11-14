import { UnixTime } from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'

import { LivenessRecordWithProjectIdAndType } from '../../../peripherals/database/LivenessRepository'
import { GroupedByType } from './groupByProjectIdAndType'

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
    result[project] = calcIntervalWithAvgsPerProject(projectRecords)
  }
  return result
}

export function calcIntervalWithAvgsPerProject({
  batchSubmissions,
  stateUpdates,
}: GroupedByType): {
  batchSubmissions: LivenessRecordsWithIntervalAndDetails | undefined
  stateUpdates: LivenessRecordsWithIntervalAndDetails | undefined
} {
  calculateIntervals(batchSubmissions.records)
  const batchSubmissionsWithIntervals = batchSubmissions.records

  calculateIntervals(stateUpdates.records)
  const stateUpdatesWithIntervals = stateUpdates.records

  return {
    batchSubmissions: calculateDetailedAverages(batchSubmissionsWithIntervals),
    stateUpdates: calculateDetailedAverages(stateUpdatesWithIntervals),
  }
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
      result.maximumInSeconds = Math.max(
        result.maximumInSeconds,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

    if (
      records.length === 0 ||
      records[0].timestamp.lt(NOW.add(timeframe, 'days'))
    ) {
      return undefined
    }

    const lastIndex = records.findIndex((record) =>
      record.timestamp.lte(NOW.add(timeframe, 'days')),
    )
    const filtered = records.slice(
      0,
      lastIndex === -1 ? records.length : lastIndex,
    )
    if (filtered[filtered.length - 1].previousRecordInterval === undefined) {
      filtered.splice(filtered.length - 1, 1)
    }

    if (filtered.length === 0) {
      return undefined
    }
    const result = { averageInSeconds: 0, maximumInSeconds: 0 }
    for (const record of filtered) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.averageInSeconds += record.previousRecordInterval!
      result.maximumInSeconds = Math.max(
        result.maximumInSeconds,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        record.previousRecordInterval!,
      )
    }
    result.averageInSeconds = Math.ceil(
      result.averageInSeconds / filtered.length,
    )
    return result
  }
}
