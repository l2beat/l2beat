import type { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'

export async function getAggregatedInteropSnapshotTimestamp(): Promise<
  UnixTime | undefined
> {
  const db = getDb()

  const timestampOverride = await db.appState.findByKey(
    'interopAggregatesTimestampOverride',
  )

  if (timestampOverride) {
    return db.aggregatedInteropTransfer.getEarliestTimestampForDay(
      timestampOverride.value,
    )
  }

  return db.aggregatedInteropTransfer.getLatestTimestamp()
}
