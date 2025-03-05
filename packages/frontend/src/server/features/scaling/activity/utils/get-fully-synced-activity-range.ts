import type { StringWithAutocomplete } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import type { TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export function getFullySyncedActivityRange(
  range: StringWithAutocomplete<TimeRange>,
): [UnixTime, UnixTime] {
  const end = UnixTime.toStartOf(UnixTime.now(), 'day')
  const days = rangeToDays(range)

  const start =
    days !== null ? end - UnixTime(days, 'days') : MIN_TIMESTAMPS.activity
  return [start, end - UnixTime(1, 'seconds')]
}
