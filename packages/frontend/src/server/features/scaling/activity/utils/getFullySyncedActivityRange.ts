import type { StringWithAutocomplete } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { MIN_TIMESTAMPS } from '~/consts/minTimestamps'
import type { TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export function getFullySyncedActivityRange(
  range:
    | { type: StringWithAutocomplete<TimeRange> }
    | { type: 'custom'; from: number; to: number },
): [UnixTime, UnixTime] {
  if (range.type === 'custom') {
    const { from, to } = range as { from: number; to: number }
    return [from, to]
  }

  const end = UnixTime.toStartOf(UnixTime.now(), 'day')
  const days = rangeToDays(range)

  const start =
    days !== null ? end - days * UnixTime.DAY : MIN_TIMESTAMPS.activity
  return [start, end - 1]
}
