import { UnixTime, type UnixTimePeriod } from '@l2beat/shared-pure'
import type { ActivityBlock } from '../services/txs/types'

export interface PeriodSum {
  timestamp: UnixTime
  count: number
  uopsCount: number | null
  start: number
  end: number
}

/** In the order of the blocks */
export function sumPerPeriod(
  blocks: ActivityBlock[],
  period: UnixTimePeriod,
): PeriodSum[] {
  const sums = new Map<UnixTime, PeriodSum>()
  for (const block of blocks) {
    const sum: PeriodSum = {
      timestamp: UnixTime.toStartOf(block.timestamp, period),
      count: block.txsCount,
      uopsCount: block.uopsCount,
      start: block.number,
      end: block.number,
    }
    const before = sums.get(sum.timestamp)
    sums.set(sum.timestamp, before ? addSums(before, sum) : sum)
  }
  return [...sums.values()]
}

/** A null uops count adds nothing */
export function addSums(a: PeriodSum, b: PeriodSum): PeriodSum {
  return {
    timestamp: a.timestamp,
    count: a.count + b.count,
    uopsCount:
      b.uopsCount === null ? a.uopsCount : (a.uopsCount ?? 0) + b.uopsCount,
    start: Math.min(a.start, b.start),
    end: Math.max(a.end, b.end),
  }
}
