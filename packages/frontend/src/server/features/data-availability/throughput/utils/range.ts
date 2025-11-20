import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getBucketValuesRange } from '~/utils/range/range'

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
  if (range.from === null) return 'daily'
  if (range.from > UnixTime.toStartOf(UnixTime.now(), 'day') - 7 * UnixTime.DAY)
    return 'hourly'
  if (
    range.from >
    UnixTime.toStartOf(UnixTime.now(), 'day') - 180 * UnixTime.DAY
  )
    return 'sixHourly'
  return 'daily'
}
