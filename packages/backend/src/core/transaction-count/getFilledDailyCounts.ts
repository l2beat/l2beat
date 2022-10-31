import { UnixTime } from '@l2beat/types'

import { fillMissingDailyCounts } from './fillMissingDailyCounts'
import { DailyTransactionCount } from './TransactionCounter'

export function getFilledDailyCounts(
  counts: DailyTransactionCount[],
  lastTimestamp?: UnixTime,
): DailyTransactionCount[] {
  const tip = counts.at(-1)?.timestamp
  const isFullySynced = tip && lastTimestamp?.lte(tip)
  const startOfDay = UnixTime.now().toStartOf('day')
  if (isFullySynced && tip.lt(startOfDay)) {
    counts.push({
      timestamp: startOfDay,
      count: 0,
    })
  }
  return fillMissingDailyCounts(counts)
}
