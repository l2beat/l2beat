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
