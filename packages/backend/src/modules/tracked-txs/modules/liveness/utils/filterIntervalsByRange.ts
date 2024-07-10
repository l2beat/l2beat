import { UnixTime, assertUnreachable } from '@l2beat/shared-pure'
import { AggregatedLivenessRange } from '../repositories/AggregatedLivenessRepository'
import { Interval } from './calculateIntervals'

export function filterIntervalsByRange(
  intervals: Interval[],
  syncTo: UnixTime,
  range: AggregatedLivenessRange,
): Interval[] {
  switch (range) {
    case '30D':
      return intervals.filter((i) =>
        i.record.timestamp.gt(syncTo.add(-30, 'days')),
      )
    case '90D':
      return intervals.filter((i) =>
        i.record.timestamp.gt(syncTo.add(-90, 'days')),
      )
    case 'MAX':
      return intervals
    default:
      assertUnreachable(range)
  }
}
