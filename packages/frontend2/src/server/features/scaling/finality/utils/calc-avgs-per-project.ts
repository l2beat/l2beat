import { UnixTime } from '@l2beat/shared-pure'

import { type LivenessRecordWithConfig } from './get-liveness-by-type-since'
import { type FinalityDataPoint } from '../schema'
import { calculateIntervals } from './calculate-intervals'
import { calculateStats } from './calculate-stats'
import { filterIntervalsByRange } from './filter-intervals-by-range'

export function calcAvgsPerProject(
  records: LivenessRecordWithConfig[],
): FinalityDataPoint | undefined {
  const intervals = calculateIntervals(records)
  const filteredIntervals = filterIntervalsByRange(
    intervals,
    UnixTime.now(),
    '30D',
  )

  if (filteredIntervals.length === 0) {
    return undefined
  }

  const stats = calculateStats(filteredIntervals)

  return {
    averageInSeconds: stats.averageInSeconds,
    maximumInSeconds: stats.maximumInSeconds,
  }
}
