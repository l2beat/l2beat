import { type FinalityDataPoint, UnixTime } from '@l2beat/shared-pure'

import { type LivenessRecordWithConfig } from './LivenessWithConfigService'
import { calculateIntervals } from './calculateIntervals'
import { calculateStats } from './calculateStats'
import { filterIntervalsByRange } from './filterIntervalsByRange'

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
