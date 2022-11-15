import { UnixTime } from '@l2beat/types'

import { fillMissingCounts } from './fillMissingCounts'
import { DailyTransactionCount } from './types'

// TODO: add tests
/**
 * Postprocess stored daily counts to accommodate for:
 * - missing days (no activity on the source api should result in 0 for that day)
 * - unfinished days (we haven't finished processing all)
 */
export function postprocessCounts(
  counts: DailyTransactionCount[],
  processedAll: boolean,
) {
  // fill holes before last processed
  const filledBefore = fillMissingCounts(counts)

  if (!processedAll) {
    // remove last day if there is a change it is incomplete
    return filledBefore.slice(-1)
  }

  const yesterday = UnixTime.now().toStartOf('day').add(-1, 'days')
  const last = filledBefore[filledBefore.length - 1]
  const lastIsYesterday = last.timestamp.toStartOf('day').equals(yesterday)

  // we have all the data we need
  if (lastIsYesterday) {
    return filledBefore
  }

  // fill holes after last processed til yesterday
  const filledAfter = fillMissingCounts([
    last,
    { timestamp: yesterday, count: 0 },
  ]).slice(1)

  return filledBefore.concat(filledAfter)
}
