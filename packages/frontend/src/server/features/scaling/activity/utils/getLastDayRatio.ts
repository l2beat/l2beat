import type { ActivityRecord } from '@l2beat/database'

export function getLastDayRatio(records: ActivityRecord[], daysAgo = 0) {
  const lastRecord = records.at(-(1 + daysAgo))
  const uops = lastRecord?.uopsCount ?? lastRecord?.count ?? 0
  const txs = lastRecord?.count ?? 0

  if (uops === 0) {
    return 1
  }

  return uops / txs
}
