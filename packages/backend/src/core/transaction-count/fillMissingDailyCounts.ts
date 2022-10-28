import { UnixTime } from '@l2beat/types'

import { DailyTransactionCount } from './TransactionCounter'

export function fillMissingDailyCounts(
  counts: DailyTransactionCount[],
  last?: UnixTime,
): DailyTransactionCount[] {
  if (counts.length === 0) return []

  const result = []
  const lastTimestamp = last ?? counts[counts.length - 1].timestamp
  let timestamp = counts[0].timestamp
  let i = 0

  while (timestamp.lte(lastTimestamp)) {
    const existing = counts.at(i)
    if (existing?.timestamp.equals(timestamp)) {
      result.push(existing)
      i++
    } else {
      result.push({ timestamp, count: 0 })
    }
    timestamp = timestamp.add(1, 'days')
  }

  return result
}
