import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { ProjectTvsConfig } from '../types'
import { getTokenSyncRange } from './getTokenSyncRange'

/**
 * Runs on every hourly tick. A token in its sync range gets the tick as its
 * target. A retired token, whose range ended before the tick, gets the last
 * hour of its range instead, with syncedUntil capped there: values past the
 * end are trimmed, so neither may point past them.
 */
export async function updateSyncMetadataTargets(
  db: Database,
  projects: ProjectTvsConfig[],
  targetTimestamp: UnixTime,
) {
  const live: string[] = []
  const retired: { id: string; end: UnixTime }[] = []

  for (const token of projects.flatMap((p) => p.tokens)) {
    const { sinceTimestamp, untilTimestamp } = getTokenSyncRange(token)
    if (sinceTimestamp > targetTimestamp) {
      continue
    }
    if (untilTimestamp === undefined || untilTimestamp >= targetTimestamp) {
      live.push(token.id)
    } else {
      retired.push({
        id: token.id,
        end: UnixTime.toStartOf(untilTimestamp, 'hour'),
      })
    }
  }

  await db.syncMetadata.upsertMany(
    live.map((id) => ({ feature: 'tvs', id, target: targetTimestamp })),
  )
  await db.syncMetadata.markEnded('tvs', retired)
}
