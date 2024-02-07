import { FinalityDataPoint } from '@l2beat/shared-pure'

import {
  calculateDetailsFor,
  calculateIntervals,
} from '../../../modules/liveness/api/calculateIntervalWithAverages'
import { LivenessRecordWithType } from '../../../modules/liveness/repositories/LivenessRepository'

export function calcAvgsPerProject(
  records: LivenessRecordWithType[],
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
