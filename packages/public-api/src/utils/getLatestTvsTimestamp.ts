import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

/** The backend targets the previous full hour and gets 15 minutes to sync. */
export const TVS_BACKEND_DELAY = UnixTime.HOUR + 15 * UnixTime.MINUTE

/**
 * The hour the backend is syncing TVS towards, the hour the website reads
 * too (frontend getLatestTvsTimestamp). Falls back to the last hour the
 * backend should have synced when it reports none.
 */
export async function getLatestTvsTimestamp(db: Database): Promise<UnixTime> {
  return (
    (await db.syncMetadata.getMaxTargetForFeature('tvs')) ??
    UnixTime.toStartOf(UnixTime.now() - TVS_BACKEND_DELAY, 'hour')
  )
}
