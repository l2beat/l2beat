import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getBucketValuesRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

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
export function rangeToResolution(value: CostsTimeRange) {
  const days = rangeToDays(value)
  if (days && days < 30) {
    return 'hourly'
  }
  if (days && days <= 90) {
    return 'sixHourly'
  }

  return 'daily'
}
