import { FinalityDataPoint } from '@l2beat/shared-pure'

import {
  calculateDetailsFor,
  calculateIntervals,
} from '../../tracked-txs/modules/liveness/api/calculateIntervalWithAverages'
import { LivenessRecordWithSubtype } from '../../tracked-txs/modules/liveness/repositories/LivenessRepository'

export function calcAvgsPerProject(
  records: LivenessRecordWithSubtype[],
): FinalityDataPoint | undefined {
  calculateIntervals(records)
  const result = calculateDetailsFor(records, '30d')
  return result
    ? {
        averageInSeconds: result.averageInSeconds,
        maximumInSeconds: result.maximumInSeconds,
      }
    : undefined
}
