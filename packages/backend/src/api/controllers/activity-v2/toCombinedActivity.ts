import {
  ActivityApiChartPoint,
  ActivityApiResponse,
  ProjectId,
} from '@l2beat/types'

import { DailyTransactionCount } from '../../../core/transaction-count/TransactionCounter'
import { findMinLast } from './findMinLast'
import { formatChart } from './formatChart'

export function toCombinedActivity(
  projectCounts: Map<ProjectId, DailyTransactionCount[]>,
): ActivityApiResponse['combined'] {
  const layer2sCounts = Array.from(projectCounts.values())
  const minLast = findMinLast(layer2sCounts)
  return formatChart(
    layer2sCounts
      .flat()
      .sort((a, b) => +a.timestamp - +b.timestamp)
      .filter((c) => (minLast ? c.timestamp.lte(minLast) : true))
      .reduce<ActivityApiChartPoint[]>((acc, { count, timestamp }) => {
        const current = acc.at(-1)
        if (!current?.[0].equals(timestamp)) {
          acc.push([timestamp, count])
        } else {
          current[1] = current[1] + count
        }
        return acc
      }, []),
  )
}
