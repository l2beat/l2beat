import { UnixTime } from '@l2beat/shared-pure'

import { fillMissingCounts } from './fillMissingCounts'
import { DailyTransactionCount } from './types'

/**
 * Postprocess stored daily counts to accommodate for:
 * - today (we cannot tell if everything has been processed until the day finishes)
 * - missing days (no activity on the source api should result in 0 for that day)
 * - unfinished days (we haven't finished processing)
 *
 * @param counts sorted in ascending order by timestamp. Timestamps are start of days
 */
export function postprocessCounts(
  counts: DailyTransactionCount[],
  processedAll: boolean,
  now: UnixTime,
): DailyTransactionCount[] {
  if (counts.length === 0) return []

  const today = now.toStartOf('day')
  const yesterday = today.add(-1, 'days')

  // fill holes before last processed
  const filledBefore = fillMissingCounts(counts)

  // remove last day if there is a chance it is incomplete
  // do not add 0s after
  if (!processedAll) {
    return filledBefore.slice(0, -1)
  }

  // remove today
  const lteYesterday = filledBefore.at(-1)?.timestamp.equals(today)
    ? filledBefore.slice(0, -1)
    : filledBefore

  const lastFull = lteYesterday[lteYesterday.length - 1]
  // we have data up til yesterday
  if (lastFull.timestamp.equals(yesterday)) {
    return lteYesterday
  }

  // fill holes after last processed til yesterday
  const filledAfter = fillMissingCounts([
    lastFull,
    { timestamp: yesterday, count: 0 },
  ]).slice(1)

  return filledBefore.concat(filledAfter)
}
