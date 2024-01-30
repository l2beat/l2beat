import { FinalityDataPoint } from '@l2beat/shared-pure'

import { LivenessRecordWithType } from '../../../peripherals/database/LivenessRepository'
import {
  calculateDetailsFor,
  calculateIntervals,
} from '../liveness/calculateIntervalWithAverages'

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
