import { DailyTransactionCount } from './types'

export function fillMissingCounts(
  counts: DailyTransactionCount[],
): DailyTransactionCount[] {
  if (counts.length === 0) return []

  const result = []
  const lastTimestamp = counts[counts.length - 1].timestamp
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
