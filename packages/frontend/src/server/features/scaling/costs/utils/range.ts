import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { getBucketValuesRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const CostsTimeRange = v.union([
  v.literal('1d'),
  v.literal('7d'),
  v.literal('30d'),
  v.literal('90d'),
  v.literal('180d'),
  v.literal('1y'),
  v.literal('max'),
])
export type CostsTimeRange = v.infer<typeof CostsTimeRange>

export function getCostsRange(
  range:
    | { type: CostsTimeRange }
    | { type: 'custom'; from: number; to: number },
): [UnixTime | null, UnixTime] {
  return getBucketValuesRange(range, rangeToResolution(range), {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })
}

export type CostsResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(
  value:
    | { type: CostsTimeRange }
    | { type: 'custom'; from: number; to: number },
) {
  const days = rangeToDays(value)
  if (days && days < 30) {
    return 'hourly'
  }
  if (days && days <= 90) {
    return 'sixHourly'
  }

  return 'daily'
}
