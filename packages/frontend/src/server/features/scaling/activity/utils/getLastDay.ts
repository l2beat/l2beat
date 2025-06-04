import type { ActivityRecord } from '@l2beat/database'
import { countPerSecond } from './countPerSecond'

export function getLastDayUops(records: ActivityRecord[], daysAgo = 0) {
  const lastRecord = records.at(-(1 + daysAgo))

  return countPerSecond(lastRecord?.uopsCount ?? lastRecord?.count ?? 0)
}

export function getLastDayTps(records: ActivityRecord[], daysAgo = 0) {
  const lastRecord = records.at(-(1 + daysAgo))

  return countPerSecond(lastRecord?.count ?? 0)
}
