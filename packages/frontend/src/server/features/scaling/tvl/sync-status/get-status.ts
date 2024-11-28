import { type IndexerStateRecord } from '@l2beat/database'
import { assert, type AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getExclusionBoundary } from './get-exclusion-boundary'

export async function getStatus<
  T extends AmountConfigEntry & { configId: string },
>(
  entries: T[],
  targetTimestamp: UnixTime,
  getIndexerId: (entry: T) => string,
  findConfig: (indexer: IndexerStateRecord, entries: T[]) => T | undefined,
) {
  const db = getDb()
  const processed = new Set<string>()
  const lagging: { id: string; latestTimestamp: UnixTime }[] = []
  const excluded = new Set<string>()

  const indexerState = await db.indexerState.getByIndexerIds(
    entries.map(getIndexerId),
  )

  for (const indexer of indexerState) {
    const config = findConfig(indexer, entries)
    assert(config, `Config should be defined for ${indexer.indexerId}`)
    processed.add(config.configId)

    const syncStatus = new UnixTime(indexer.safeHeight)
    if (syncStatus.gte(targetTimestamp)) {
      continue
    }

    // TODO: what about max height?
    if (syncStatus.lt(getExclusionBoundary(targetTimestamp))) {
      excluded.add(config.configId)
    } else {
      lagging.push({
        id: config.configId,
        latestTimestamp: syncStatus,
      })
    }
  }

  const unprocessed = entries.filter((c) => !processed.has(c.configId))
  unprocessed.forEach((u) => excluded.add(u.configId))

  return { excluded, lagging }
}
