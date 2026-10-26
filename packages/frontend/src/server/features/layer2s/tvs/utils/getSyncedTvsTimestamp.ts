import type { TvsToken } from '@l2beat/config'
import type { SyncMetadataRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { getTvsTargetTimestamp } from './getTvsTargetTimestamp'
import { isTvsSynced } from './isTvsSynced'

const cache = new FrontendInMemoryCache('getTvsSyncMetadata')

/** TVS sync metadata rows by token id */
export type TvsSyncMetadata = Map<string, SyncMetadataRecord>

/**
 * Every TVS sync metadata row, one per token. Cached briefly, so lists and
 * parallel page loaders that each need it share one query.
 */
export function getTvsSyncMetadata(): Promise<TvsSyncMetadata> {
  // Mock mode has no database; getSyncedTvsTimestamp falls back to the clock
  if (env.MOCK) {
    return Promise.resolve(new Map())
  }
  return cache.get({ key: ['tvs', 'sync-metadata'], ttl: 60 }, async () => {
    const records = await getDb().syncMetadata.getByFeature('tvs')
    return new Map(records.map((r) => [r.id, r]))
  })
}

/**
 * The latest hour for which every token of a project has a value, so that
 * "value at or before" lookups at it never mix two hours in its total.
 * Each project gets its own hour: one that lags does not hold others back.
 *
 * Skipped rows:
 * - older target: the token left the config (or its untilTimestamp passed)
 *   and the backend stopped advancing the row, which would pin the hour
 * - stale, see isTvsSynced: a stuck or backfilling token should not hold
 *   everything back; it is flagged as unsynced instead
 *
 * Falls back to the wall-clock estimate when no row qualifies.
 */
export function getSyncedTvsTimestamp(
  syncMetadata: TvsSyncMetadata,
  tokens: { id: string }[],
): UnixTime {
  const hours = getCurrentRecords(syncMetadata, tokens).map(
    (r) => r.syncedUntil,
  )
  return hours.length > 0 ? Math.min(...hours) : getTvsTargetTimestamp()
}

/**
 * The tokens holding a project's hour before getTvsTargetTimestamp, the hour
 * it should have reached by now. Tables flag them: every value they show is
 * from the project's hour, so none looks out of date by itself.
 */
export function getLateTvsTokenIds(
  syncMetadata: TvsSyncMetadata,
  tokens: { id: string }[],
): Set<string> {
  const expected = getTvsTargetTimestamp()
  return new Set(
    getCurrentRecords(syncMetadata, tokens)
      .filter((r) => r.syncedUntil < expected)
      .map((r) => r.id),
  )
}

/** The rows getSyncedTvsTimestamp takes the hour from, see its skip list */
function getCurrentRecords(
  syncMetadata: TvsSyncMetadata,
  tokens: { id: string }[],
): (SyncMetadataRecord & { syncedUntil: UnixTime })[] {
  const records = tokens
    .map((t) => syncMetadata.get(t.id))
    .filter((r) => r !== undefined)
  const latestTarget = records.reduce((max, r) => Math.max(max, r.target), 0)
  return records.filter(
    (r): r is SyncMetadataRecord & { syncedUntil: UnixTime } =>
      r.target === latestTarget &&
      r.syncedUntil !== null &&
      isTvsSynced(r.syncedUntil),
  )
}

/**
 * The tokens a summed query keeps under the same options. Pass these to
 * getSyncedTvsTimestamp, so a lagging token the query leaves out cannot hold
 * the hour back.
 */
export function withoutExcludedTokens<
  T extends Pick<TvsToken, 'isAssociated' | 'category'>,
>(
  tokens: T[],
  opts: {
    excludeAssociatedTokens: boolean
    excludeRwaRestrictedTokens: boolean
  },
): T[] {
  return tokens.filter(
    (t) =>
      !(opts.excludeAssociatedTokens && t.isAssociated) &&
      !(opts.excludeRwaRestrictedTokens && t.category === 'rwaRestricted'),
  )
}
