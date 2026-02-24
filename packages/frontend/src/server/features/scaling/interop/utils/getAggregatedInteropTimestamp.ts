import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'

export function getAggregatedInteropTimestamp(): Promise<UnixTime | undefined> {
  if (env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE !== undefined) {
    return Promise.resolve(env.INTEROP_AGGREGATE_TIMESTAMP_OVERRIDE)
  }

  return getDb().aggregatedInteropTransfer.getLatestTimestamp()
}
