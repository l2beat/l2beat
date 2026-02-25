import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export async function getAggregatedInteropTimestamp(): Promise<
  UnixTime | undefined
> {
  const db = getDb()

  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()
  if (env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE !== undefined) {
    return latestTimestamp
  }

  if (!latestTimestamp) {
    return undefined
  }

  return (
    (await db.aggregatedInteropTransfer.getEarliestTimestampForDay(
      latestTimestamp,
    )) ?? latestTimestamp
  )
}
