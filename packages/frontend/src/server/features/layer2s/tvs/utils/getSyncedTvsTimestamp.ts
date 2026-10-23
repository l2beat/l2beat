import type { TvsToken } from '@l2beat/config'
import type { Database, SyncMetadataRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getTvsTargetTimestamp } from './getTvsTargetTimestamp'
import { isTvsSynced } from './isTvsSynced'

let pending: Promise<SyncMetadataRecord[]> | undefined

/**
 * Every TVS sync metadata row, one per token. Callers awaiting at the same
 * time share one query, so lists and parallel page loaders don't repeat it.
 */
export function getTvsSyncMetadata(
  repository?: Database['syncMetadata'],
): Promise<SyncMetadataRecord[]> {
  // Mock mode has no database; getSyncedTvsTimestamp falls back to the clock
  if (env.MOCK) {
    return Promise.resolve([])
  }
  pending ??= (repository ?? getDb().syncMetadata)
    .getByFeature('tvs')
    .finally(() => {
      pending = undefined
    })
  return pending
}

/**
 * The latest hour for which every listed token has a value, so that
 * "value at or before" lookups at it never mix two hours in one total.
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
  syncMetadata: SyncMetadataRecord[],
  tokens: { id: string }[],
): UnixTime {
  const tokenIds = new Set(tokens.map((t) => t.id))
  const records = syncMetadata.filter((r) => tokenIds.has(r.id))
  const latestTarget = records.reduce((max, r) => Math.max(max, r.target), 0)

  let synced: UnixTime | undefined
  for (const { target, syncedUntil } of records) {
    if (
      target === latestTarget &&
      syncedUntil !== null &&
      isTvsSynced(syncedUntil)
    ) {
      synced =
        synced === undefined ? syncedUntil : Math.min(synced, syncedUntil)
    }
  }
  return synced ?? getTvsTargetTimestamp()
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
