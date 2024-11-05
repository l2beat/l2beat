import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { rangeToDays } from '~/utils/range/range-to-days'

export const CostsTimeRange = z.union([
  z.literal('1d'),
  z.literal('7d'),
  z.literal('30d'),
  z.literal('90d'),
  z.literal('180d'),
])
export type CostsTimeRange = z.infer<typeof CostsTimeRange>

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export function getFullySyncedCostsRange(
  range: CostsTimeRange,
): [UnixTime, UnixTime] {
  const days = rangeToDays(range)

  const startOfDay = UnixTime.now().toStartOf('day')

  const end = startOfDay
  const start = end.add(-days, 'days')
  return [start, end]
}

export type CostsResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(value: CostsTimeRange) {
  const days = rangeToDays(value)
  if (days < 30) {
    return 'hourly'
  }

  return 'daily'
}
