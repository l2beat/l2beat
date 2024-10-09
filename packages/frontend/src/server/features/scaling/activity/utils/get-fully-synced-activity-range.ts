import { type StringWithAutocomplete, UnixTime } from '@l2beat/shared-pure'
import { type TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export function getFullySyncedActivityRange(
  range: StringWithAutocomplete<TimeRange>,
): [UnixTime, UnixTime] {
  const end = UnixTime.now().toStartOf('day')

  if (range === 'max') return [new UnixTime(0), end.add(-1, 'seconds')]

  const days = rangeToDays(range)

  const start = end.add(-days, 'days')
  return [start, end.add(-1, 'seconds')]
}
