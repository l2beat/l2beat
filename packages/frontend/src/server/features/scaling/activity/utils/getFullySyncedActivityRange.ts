import type { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import type { ActivityTimeRange } from './range'
import { getActivityAdjustedTimestamp } from './syncStatus'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export async function getFullySyncedActivityRange(
  range: ActivityTimeRange,
): Promise<[UnixTime | null, UnixTime]> {
  const db = getDb()

  const target = await db.syncMetadata.getMaxTargetForFeature('activity')
  const end = getActivityAdjustedTimestamp(target)

  return [range.from, Math.min(range.to, end)]
}
