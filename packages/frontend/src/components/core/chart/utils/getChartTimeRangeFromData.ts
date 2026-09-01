import { UnixTime } from '@l2beat/shared-pure'
import type { ChartResolution } from '~/utils/range/range'

export function getChartTimeRangeFromData<T extends { timestamp: number }>(
  data: T[] | undefined,
  opts?: {
    /**
     * Set when the data timestamps are buckets/aggregates of this size. A
     * bucket at timestamp `t` covers `[t, t + bucket)`, so the range end is
     * extended by one bucket. Omit for point-in-time data (e.g. TVS) that must
     * not be extended.
     */
    bucket?: ChartResolution
  },
): [number, number] | undefined {
  if (!data) {
    return
  }

  const start = data.at(0)?.timestamp
  const end = data.at(-1)?.timestamp

  if (!start || !end) {
    return
  }

  const endOffset = opts?.bucket ? UnixTime.periodToSeconds(opts.bucket) : 0
  return [start, end + endOffset]
}
