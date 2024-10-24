import { type ActivityRecord } from '@l2beat/database'
import { countToUops } from './count-to-uops'

export function getLastDayUops(records: ActivityRecord[], daysAgo = 0) {
  const lastRecord = records.at(-(1 + daysAgo))

  return countToUops(lastRecord?.uopsCount ?? lastRecord?.count ?? 0)
}
