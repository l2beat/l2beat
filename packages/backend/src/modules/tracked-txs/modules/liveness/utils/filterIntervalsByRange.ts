import type { AggregatedLivenessRange } from '@l2beat/database'
import { UnixTime, assertUnreachable } from '@l2beat/shared-pure'
import type { Interval } from './calculateIntervals'

export function filterIntervalsByRange(
  intervals: Interval[],
  syncTo: UnixTime,
  range: AggregatedLivenessRange,
): Interval[] {
  switch (range) {
    case '30D':
      return intervals.filter(
        (i) => i.record.timestamp > syncTo - 30 * UnixTime.DAY,
      )
    case '90D':
      return intervals.filter(
        (i) => i.record.timestamp > syncTo - 90 * UnixTime.DAY,
      )
    case 'MAX':
      return intervals
    default:
      assertUnreachable(range)
  }
}
