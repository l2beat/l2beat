import type { LivenessRecordWithConfig } from './mapToRecordWithConfig'

export type Interval = {
  record: LivenessRecordWithConfig
  duration: number
}

export function calculateIntervals(
  records: LivenessRecordWithConfig[],
): Interval[] {
  const intervals: Interval[] = []
  for (let i = 1; i < records.length; i++) {
    intervals.push({
      record: records[i],
      duration: records[i - 1].timestamp - records[i].timestamp,
    })
  }
  return intervals
}
