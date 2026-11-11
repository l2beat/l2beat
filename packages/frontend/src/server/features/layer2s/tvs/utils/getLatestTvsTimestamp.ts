import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { getTvsTargetTimestamp } from './getTvsTargetTimestamp'

const cache = new FrontendInMemoryCache('getLatestTvsTimestamp')

/**
 * The hour the backend is syncing TVS towards. Reads take each token's value
 * at or before it, so every project shows its newest synced hour.
 *
 * Within a project, those values come from one hour: the backend has one
 * value indexer per project, and it saves all of the project's tokens for an
 * hour in one transaction (see TokenValueIndexer). Two kinds of token still
 * lag: one whose config changed, until it syncs again from its start, and
 * one past its untilTimestamp.
 */
export function getLatestTvsTimestamp(): Promise<UnixTime> {
  // Mock mode has no database
  if (env.MOCK) {
    return Promise.resolve(getTvsTargetTimestamp())
  }
  return cache.get(
    { key: ['tvs', 'latest-timestamp'], ttl: 60 },
    async () =>
      // No rows when the backend doesn't run TVS
      (await getDb().syncMetadata.getMaxTargetForFeature('tvs')) ??
      getTvsTargetTimestamp(),
  )
}
