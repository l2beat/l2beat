import { ProjectId } from '@l2beat/shared-pure'

import { findMinLast } from './findMinLast'
import { DailyTransactionCount } from './types'

export function toCombinedActivity(
  projectCounts: Map<ProjectId, DailyTransactionCount[]>,
): DailyTransactionCount[] {
  const layer2sCounts = Array.from(projectCounts.values())
  const minLast = findMinLast(layer2sCounts)
  return layer2sCounts
    .flat()
    .sort((a, b) => +a.timestamp - +b.timestamp)
    .filter((c) => (minLast ? c.timestamp.lte(minLast) : true))
    .reduce<DailyTransactionCount[]>((acc, { count, timestamp }) => {
      const current = acc.at(-1)
      if (!current?.timestamp.equals(timestamp)) {
        acc.push({ timestamp, count })
      } else {
        current.count = current.count + count
      }
      return acc
    }, [])
}
