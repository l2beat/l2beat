import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getBucketValuesRange } from '~/utils/range/range'

export type CostsTimeRange = v.infer<typeof CostsTimeRange>
export const CostsTimeRange = v.object({
  from: v.union([v.number(), v.null()]),
  to: v.number(),
})

export function getCostsRange(
  range: CostsTimeRange,
): [UnixTime | null, UnixTime] {
  return getBucketValuesRange(range, rangeToResolution(range), {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })
}

export type CostsResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(range: CostsTimeRange) {
  if (range.from === null) return 'daily'
  if (
    range.from >
    UnixTime.toStartOf(UnixTime.now(), 'day') - 30 * UnixTime.DAY
  )
    return 'hourly'
  if (
    range.from >
    UnixTime.toStartOf(UnixTime.now(), 'day') - 90 * UnixTime.DAY
  )
    return 'sixHourly'
  return 'daily'
}
