import { UnixTime } from '@l2beat/shared-pure'
import { type TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export function getFullySyncedActivityRange(
  range: TimeRange,
): [UnixTime, UnixTime] {
  const days = rangeToDays(range)

  const startOfDay = UnixTime.now().toStartOf('day')

  const end = startOfDay
  const start = end.add(-days, 'days')
  return [start, end]
}
