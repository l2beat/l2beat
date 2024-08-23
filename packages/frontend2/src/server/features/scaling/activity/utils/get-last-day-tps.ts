import { type ActivityRecord } from '@l2beat/database'
import { countToTps } from './count-to-tps'

export function getLastDayTps(records: ActivityRecord[], daysAgo = 0) {
  const lastRecord = records.at(-(1 + daysAgo))

  return countToTps(lastRecord?.count ?? 0)
}
