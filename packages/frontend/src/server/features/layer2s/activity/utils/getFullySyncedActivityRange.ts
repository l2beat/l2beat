import { getDb } from '~/server/database'
import type { ChartRange } from '~/utils/range/range'
import { getActivityAdjustedTimestamp } from './syncStatus'

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export async function getFullySyncedActivityRange(
  range: ChartRange,
): Promise<ChartRange> {
  const db = getDb()

  const target = await db.syncMetadata.getMaxTargetForFeature('activity')
  const end = getActivityAdjustedTimestamp(target)

  return [range[0], Math.min(range[1], end)]
}
