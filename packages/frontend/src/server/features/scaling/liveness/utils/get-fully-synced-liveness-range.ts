import type { StringWithAutocomplete } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import type { TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to 2 hours ago.
 */
export function getFullySyncedLivenessRange(
  range: StringWithAutocomplete<TimeRange>,
): [UnixTime, UnixTime] {
  const end = UnixTime.toStartOf(UnixTime.now(), 'hour') - 2 * UnixTime.HOUR
  const days = rangeToDays(range)

  const start =
    days !== null ? end - days * UnixTime.DAY : MIN_TIMESTAMPS.liveness
  return [start, end - 1]
}
