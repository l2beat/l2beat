import { LivenessRecordWithSubtype } from '../repositories/LivenessRepository'

export type Interval = {
  record: LivenessRecordWithSubtype
  duration: number
}

export function calculateIntervals(
  records: LivenessRecordWithSubtype[],
): Interval[] {
  const intervals: Interval[] = []
  for (let i = 1; i < records.length; i++) {
    intervals.push({
      record: records[i],
      duration:
        records[i - 1].timestamp.toNumber() - records[i].timestamp.toNumber(),
    })
  }
  return intervals
}
