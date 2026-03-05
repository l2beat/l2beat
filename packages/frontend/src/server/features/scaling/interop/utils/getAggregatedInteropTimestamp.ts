import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export function getAggregatedInteropTimestamp(): Promise<UnixTime | undefined> {
  return getAggregatedInteropTimestampWithOverride()
}

export async function getAggregatedInteropTimestampWithOverride(
  forcedTimestamp?: UnixTime,
): Promise<UnixTime | undefined> {
  const db = getDb()

  if (forcedTimestamp !== undefined) {
    return forcedTimestamp
  }

  if (env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE !== undefined) {
    return db.aggregatedInteropTransfer.getEarliestTimestampForDay(
      env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE,
    )
  }

  const latestPromoted = await db.interopAggregationQuality.findLatestPromoted()
  if (latestPromoted) {
    return latestPromoted.timestamp
  }

  return db.aggregatedInteropTransfer.getLatestTimestamp()
}
