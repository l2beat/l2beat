import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { MIN_TIMESTAMPS } from '~/consts/minTimestamps'
import type { TimeRange } from '~/utils/range/range'
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

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export function getFullySyncedCostsRange(
  range: { type: TimeRange } | { type: 'custom'; from: number; to: number },
): [UnixTime, UnixTime] {
  if (range.type === 'custom') {
    const { from, to } = range as { from: number; to: number }
    return [from, to]
  }

  const resolution = rangeToResolution(range.type)

  const end = UnixTime.toStartOf(
    UnixTime.now(),
    resolution === 'hourly'
      ? 'hour'
      : resolution === 'sixHourly'
        ? 'six hours'
        : 'day',
  )
  const days = rangeToDays(range)

  const start =
    days !== null ? end - days * UnixTime.DAY : MIN_TIMESTAMPS.activity
  return [start, end - 1]
}

export type CostsResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(value: CostsTimeRange) {
  const days = rangeToDays({ type: value })
  if (days && days < 30) {
    return 'hourly'
  }
  if (days && days <= 90) {
    return 'sixHourly'
  }

  return 'daily'
}
