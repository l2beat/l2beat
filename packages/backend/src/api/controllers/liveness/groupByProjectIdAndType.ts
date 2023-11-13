import { groupBy, mapValues } from 'lodash'

import { LivenessRecordWithProjectIdAndType } from '../../../peripherals/database/LivenessRepository'
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
