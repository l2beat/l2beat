import type { UnixTime } from '@l2beat/shared-pure'
import type { ActivityTimeRange } from './range'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export async function getFullySyncedActivityRange(
  range: ActivityTimeRange,
): Promise<[UnixTime | null, UnixTime]> {
  const { from, to } = range
  return await Promise.resolve([from, to])
  // const db = getDb()

  // const target = await db.syncMetadata.getMaxTargetForFeature('activity')
  // const end = getActivityAdjustedTimestamp(target)
  // const days = rangeToDays(range)

  // const start = days !== null ? end - (days - 1) * UnixTime.DAY : null
  // return [start, end]
}
