import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export function getFullySyncedPrivacyRange([from, to]: ChartRange): ChartRange {
  const minEnd = Math.min(UnixTime.now(), to)

  return [
    from ? UnixTime.toStartOf(from, 'day') : null,
    UnixTime.toStartOf(minEnd, 'day'),
  ]
}
