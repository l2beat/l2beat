import type { IndexerStateRecord } from '@l2beat/database'
import type { AmountConfigEntry } from '@l2beat/shared-pure'
import { assert, UnixTime } from '@l2beat/shared-pure'
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

    const latestTimestamp = new UnixTime(indexer.safeHeight)
    if (latestTimestamp.gte(targetTimestamp)) {
      continue
    }

    // TODO: what about max height?
    if (latestTimestamp.lt(getExclusionBoundary(targetTimestamp))) {
      excluded.add(config.configId)
    } else {
      lagging.push({
        id: config.configId,
        latestTimestamp,
      })
    }
  }

  const unprocessed = entries.filter((c) => !processed.has(c.configId))
  unprocessed.forEach((u) => excluded.add(u.configId))

  return { excluded, lagging }
}
