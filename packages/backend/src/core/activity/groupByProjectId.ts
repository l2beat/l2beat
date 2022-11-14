import { ProjectId } from '@l2beat/types'

import { DailyTransactionCountRecord } from '../../peripherals/database/activity-v2/DailyTransactionCountRepository'
import { DailyTransactionCount } from './types'

export function groupByProjectId(
  allCounts: DailyTransactionCountRecord[],
): Map<ProjectId, DailyTransactionCount[]> {
  return allCounts.reduce<Map<ProjectId, DailyTransactionCount[]>>(
    (acc, { projectId, count, timestamp }) => {
      const counts = acc.get(projectId) ?? []
      counts.push({ count, timestamp })
      acc.set(projectId, counts)
      return acc
    },
    new Map(),
  )
}
