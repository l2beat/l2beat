import { FinalityDataPoint, UnixTime } from '@l2beat/shared-pure'

import { LivenessRecordWithSubtype } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'
import { calculateIntervals } from '../../tracked-txs/modules/liveness/utils/calculateIntervals'
import { calculateStats } from '../../tracked-txs/modules/liveness/utils/calculateStats'
import { filterIntervalsByRange } from '../../tracked-txs/modules/liveness/utils/filterIntervalsByRange'

export function calcAvgsPerProject(
  records: LivenessRecordWithSubtype[],
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
