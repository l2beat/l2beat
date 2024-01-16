import { LivenessDataPoint } from '@l2beat/shared-pure'

import { LivenessRecordWithType } from '../../../peripherals/database/LivenessRepository'
import {
  calculateDetailsFor,
  calculateIntervals,
} from '../liveness/calculateIntervalWithAverages'

export function calcAvgsPerProject(
  records: LivenessRecordWithType[],
): LivenessDataPoint | undefined {
  calculateIntervals(records)
  return calculateDetailsFor(records, '30d')
}
