import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getAggregatedInteropSnapshotTimestamp(): Promise<
  UnixTime | undefined
> {
  if (env.MOCK) {
    return UnixTime.toStartOf(UnixTime.now(), 'hour')
  }
  const db = getDb()

  const timestampOverride = await db.appState.findByKey(
    'interopAggregatesTimestampOverride',
  )

  if (timestampOverride) {
    return db.aggregatedInteropTransfer.getEarliestTimestampForDay(
      timestampOverride.value,
    )
  }

  return db.interopAggregateStatus.getLatestPromotedTimestamp()
}

/**
 * A client-supplied timestamp pins a snapshot the page already shows, so only
 * a promoted one is honoured. Anything else (a blocked snapshot, a guess, a
 * non-integer) is ignored and the caller resolves the default snapshot
 * instead, which under `interopAggregatesTimestampOverride` may be that same
 * unpromoted snapshot.
 */
export async function getPromotedInteropSnapshotTimestamp(
  requested: number | undefined,
): Promise<UnixTime | undefined> {
  if (requested === undefined || !Number.isInteger(requested) || env.MOCK) {
    return undefined
  }
  const timestamp = UnixTime(requested)
  const status = await getDb().interopAggregateStatus.getByTimestamp(timestamp)
  return status?.status === 'promoted' ? timestamp : undefined
}
