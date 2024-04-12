import {
  LivenessDataPoint,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { Dictionary } from 'lodash'

import { LivenessRecordWithProjectIdAndSubtype } from '../repositories/LivenessRepository'
import { GroupedByType } from './groupByType'

export type LivenessRecordWithInterval = Omit<
  LivenessRecordWithProjectIdAndSubtype,
  'projectId'
> & {
  previousRecordInterval?: number
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

export interface LivenessDetails {
  last30Days: LivenessDataPoint | undefined
  last90Days: LivenessDataPoint | undefined
  allTime: LivenessDataPoint | undefined
}
export interface LivenessRecordsWithIntervalAndDetails<
  T = LivenessRecordWithInterval,
> extends LivenessDetails {
  records: T[]
}

export function calculateIntervalWithAverages(
  records: Record<
    string,
    Record<
      TrackedTxsConfigSubtype,
      {
        records: Omit<LivenessRecordWithProjectIdAndSubtype, 'projectId'>[]
      }
    >
  >,
) {
  const result: Dictionary<
    Record<
      TrackedTxsConfigSubtype,
      LivenessRecordsWithIntervalAndDetails | undefined
    >
  > = {}
  for (const project in records) {
    const projectRecords = records[project]
    result[project] = calcIntervalWithAvgsPerProject(projectRecords)
  }
  return result
}

export function calcIntervalWithAvgsPerProject({
  batchSubmissions,
  stateUpdates,
  proofSubmissions,
}: GroupedByType): Record<
  TrackedTxsConfigSubtype,
  LivenessRecordsWithIntervalAndDetails | undefined
> {
  calculateIntervals(batchSubmissions.records)
  const batchSubmissionsWithIntervals = batchSubmissions.records

  calculateIntervals(stateUpdates.records)
  const stateUpdatesWithIntervals = stateUpdates.records

  calculateIntervals(proofSubmissions.records)
  const proofSubmissionsWithIntervals = proofSubmissions.records

  return {
    batchSubmissions: calculateDetailedAverages(batchSubmissionsWithIntervals),
    stateUpdates: calculateDetailedAverages(stateUpdatesWithIntervals),
    proofSubmissions: calculateDetailedAverages(proofSubmissionsWithIntervals),
  }
}

function calculateDetailedAverages(
  intervals: LivenessRecordWithInterval[] | undefined,
): LivenessRecordsWithIntervalAndDetails | undefined {
  if (!intervals || intervals.length <= 1) {
    return undefined
  }

  const averages = calculateMinMaxAverages(intervals)
  return {
    records: intervals,
    last30Days: averages.last30Days,
    last90Days: averages.last90Days,
    allTime: averages.allTime,
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

export function calculateMinMaxAverages(
  records: LivenessRecordWithInterval[],
): LivenessDetails {
  const last30Days = calculateDetailsFor(records, '30d')
  const last90Days = calculateDetailsFor(records, '90d')
  const allTime = calculateDetailsFor(records, 'allTime')

  return {
    last30Days,
    last90Days,
    allTime,
  }
}

export function calculateDetailsFor(
  records: readonly LivenessRecordWithInterval[],
  type: '30d' | '60d' | '90d' | 'allTime',
): LivenessDataPoint | undefined {
  if (type === 'allTime') {
    if (records.length === 0) {
      return undefined
    }
    const result = {
      averageInSeconds: 0,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      minimumInSeconds: Infinity,
      maximumInSeconds: 0,
    }
    for (const record of records.slice(0, records.length - 1)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.averageInSeconds += record.previousRecordInterval!
      result.minimumInSeconds = Math.min(
        result.minimumInSeconds,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        record.previousRecordInterval!,
      )
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
    const result = {
      averageInSeconds: 0,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      minimumInSeconds: Infinity,
      maximumInSeconds: 0,
    }
    for (const record of filtered) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result.averageInSeconds += record.previousRecordInterval!
      result.minimumInSeconds = Math.min(
        result.minimumInSeconds,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        record.previousRecordInterval!,
      )
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
