import { LivenessDataPoint } from '@l2beat/shared-pure'

import {
  LivenessRecordWithProjectIdAndType,
  LivenessRecordWithType,
} from '../../../peripherals/database/LivenessRepository'
import { calculateDetailsFor } from '../liveness/calculateIntervalWithAverages'

export type LivenessRecordWithInterval = Omit<
  LivenessRecordWithProjectIdAndType,
  'projectId'
> & {
  previousRecordInterval?: number
}

export function calcAvgsPerProject(
  records: LivenessRecordWithType[],
): LivenessDataPoint | undefined {
  calculateIntervals(records)
  return calculateDetailsFor(records, '30d')
}

export function calculateIntervals(
  records: LivenessRecordWithInterval[],
): void {
  for (let i = 0; i < records.length - 1; i++) {
    records[i].previousRecordInterval =
      records[i].timestamp.toNumber() - records[i + 1].timestamp.toNumber()
  }
}
