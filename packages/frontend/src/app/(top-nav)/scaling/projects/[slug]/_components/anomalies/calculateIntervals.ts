import type { UnixTime } from '@l2beat/shared-pure';

export type Interval = {
  timestamp: UnixTime;
  duration: number;
};

export function calculateIntervals(records: UnixTime[]): Interval[] {
  const intervals: Interval[] = [];
  for (let i = 1; i < records.length; i++) {
    intervals.push({
      timestamp: records[i]!,
      duration: records[i - 1]!.toNumber() - records[i]!.toNumber(),
    });
  }
  return intervals;
}
