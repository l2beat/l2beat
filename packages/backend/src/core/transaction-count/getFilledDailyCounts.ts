import { UnixTime } from '@l2beat/types'

import { fillMissingDailyCounts } from './fillMissingDailyCounts'
import { DailyTransactionCount } from './TransactionCounter'

export function getFilledDailyCounts(
  now: UnixTime,
  counts: DailyTransactionCount[],
  latest: UnixTime,
  tip?: UnixTime,
): DailyTransactionCount[] {
  const countsToFill = getCountsToFill(now, counts, latest, tip)
  return fillMissingDailyCounts(countsToFill)
}

function getCountsToFill(
  now: UnixTime,
  counts: DailyTransactionCount[],
  latest: UnixTime,
  tip?: UnixTime,
) {
  const startOfYesterday = now.toStartOf('day').add(-1, 'days')
  const isSynced = tip?.equals(latest)

  if (!isSynced) {
    return counts.filter((c) => c.timestamp.lte(startOfYesterday))
  }

  const latestBeforeYesterday = latest.lt(startOfYesterday)
  if (latestBeforeYesterday) {
    return counts.concat([{ timestamp: startOfYesterday, count: 0 }])
  }

  return counts
}
