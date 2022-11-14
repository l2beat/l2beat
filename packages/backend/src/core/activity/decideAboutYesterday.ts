import { UnixTime } from '@l2beat/types'

import { DailyTransactionCount } from './types'

export function decideAboutYesterday(
  counts: DailyTransactionCount[],
  yesterday: UnixTime,
  lastReached: boolean,
): DailyTransactionCount[] {
  if (!lastReached) {
    return counts.slice(-1)
  }

  const lastIsYesterday = counts
    .at(-1)
    ?.timestamp.toStartOf('day')
    .equals(yesterday)

  return lastIsYesterday
    ? counts
    : counts.concat([{ timestamp: yesterday, count: 0 }])
}
