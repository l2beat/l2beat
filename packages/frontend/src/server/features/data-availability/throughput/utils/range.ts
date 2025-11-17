import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getBucketValuesRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const DaThroughputTimeRangeValues = [
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
] as const

export type DaThroughputTimeRange = v.infer<typeof DaThroughputTimeRange>
export const DaThroughputTimeRange = v.object({
  from: v.union([v.number(), v.null()]),
  to: v.number(),
})

/**
 * Returns a range of days that are fully synced.
 */
export function getThroughputRange(
  range: DaThroughputTimeRange,
): [UnixTime | null, UnixTime] {
  return getBucketValuesRange(range, rangeToResolution(range), {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })
}

export type DaThroughputResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(range: DaThroughputTimeRange) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
