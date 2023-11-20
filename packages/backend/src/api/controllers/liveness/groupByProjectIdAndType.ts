import { groupBy, mapValues } from 'lodash'

import {
  LivenessRecordWithProjectIdAndType,
  LivenessRecordWithType,
} from '../../../peripherals/database/LivenessRepository'
import { groupByAndOmit } from '../utils/grouping'

export function groupByProjectIdAndType(
  allRecords: LivenessRecordWithProjectIdAndType[],
) {
  return mapValues(
    mapValues(groupByAndOmit(allRecords, 'projectId'), (firstGroupingResult) =>
      groupBy(firstGroupingResult, (item) => item.type),
    ),
    (
      value: Record<
        string,
        Omit<LivenessRecordWithProjectIdAndType, 'projectId'>[] | undefined
      >,
    ) => {
      return {
        batchSubmissions: {
          records:
            value.DA?.slice().sort(
              (a, b) => b.timestamp.toNumber() - a.timestamp.toNumber(),
            ) ?? [],
        },
        stateUpdates: {
          records:
            value.STATE?.slice().sort(
              (a, b) => b.timestamp.toNumber() - a.timestamp.toNumber(),
            ) ?? [],
        },
      }
    },
  )
}

export interface GroupedByType {
  batchSubmissions: {
    records: LivenessRecordWithType[]
  }
  stateUpdates: {
    records: LivenessRecordWithType[]
  }
}

export function groupByType(records: LivenessRecordWithType[]): GroupedByType {
  return {
    batchSubmissions: {
      records: records
        .filter((record) => record.type === 'DA')
        .sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber()),
    },
    stateUpdates: {
      records: records
        .filter((record) => record.type === 'STATE')
        .sort((a, b) => b.timestamp.toNumber() - a.timestamp.toNumber()),
    },
  }
}
