import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'

/**
 * Returns a range of days that are fully synced. Current day is not included.
 *
 * Unlike activity, DA has no per-feature sync target — data for past days is
 * complete and only the current day is partial, so the range end is simply
 * capped at the start of today. The end of the range is exclusive, matching
 * the DataAvailability repository queries.
 */
export function getFullySyncedDaRange(range: ChartRange): ChartRange {
  const startOfToday = UnixTime.toStartOf(UnixTime.now(), 'day')
  return [range[0], Math.min(range[1], startOfToday)]
}
