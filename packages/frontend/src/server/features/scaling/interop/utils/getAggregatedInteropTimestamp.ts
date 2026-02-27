import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export function getAggregatedInteropTimestamp(): Promise<UnixTime | undefined> {
  const db = getDb()

  if (env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE !== undefined) {
    return db.aggregatedInteropTransfer.getEarliestTimestampForDay(
      env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE,
    )
  }

  return db.aggregatedInteropTransfer.getLatestTimestamp()
}
