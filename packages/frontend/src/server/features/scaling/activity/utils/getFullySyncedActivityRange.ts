import type { StringWithAutocomplete } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type { TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { getActivityAdjustedTimestamp } from './syncStatus'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export async function getFullySyncedActivityRange(
  range:
    | { type: StringWithAutocomplete<TimeRange> }
    | { type: 'custom'; from: number; to: number },
): Promise<[UnixTime | null, UnixTime]> {
  if (range.type === 'custom') {
    const { from, to } = range as { from: number; to: number }
    return [from, to]
  }
  const db = getDb()

  const target = await db.syncMetadata.getMaxTargetForFeature('activity')
  const end = getActivityAdjustedTimestamp(target)
  const days = rangeToDays(range)

  const start = days !== null ? end - (days - 1) * UnixTime.DAY : null
  return [start, end]
}
