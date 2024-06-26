import { UnixTime, notUndefined } from '@l2beat/shared-pure'
import { sql } from 'kysely'
import { PostgresDatabase } from '../kysely'
import { DB } from '../kysely/generated/types'

export interface CleanDateRange {
  from: UnixTime | undefined
  to: UnixTime
}

type TablesWithTimestamp = {
  [K in keyof DB]: DB[K] extends { timestamp: unknown } ? K : never
}[keyof DB]

/**
 * WARNING: this method requires table to have timestamp column
 */
export function deleteHourlyUntil(
  db: PostgresDatabase,
  tableName: TablesWithTimestamp,
  dateRange: CleanDateRange,
) {
  return db
    .deleteFrom(tableName)
    .where((eb) =>
      eb.and(
        [
          eb('timestamp', '<', dateRange.to.toDate()),
          dateRange.from && eb('timestamp', '>=', dateRange.from.toDate()),
          // do not delete six hourly and daily
          eb(sql`extract(hour from "timestamp") % 6`, '!=', 0),
        ].filter(notUndefined),
      ),
    )
    .execute()
}

/**
 * WARNING: this method requires table to have timestamp column
 */
export function deleteSixHourlyUntil(
  db: PostgresDatabase,
  tableName: TablesWithTimestamp,
  dateRange: CleanDateRange,
) {
  return db
    .deleteFrom(tableName)
    .where((eb) =>
      eb.and(
        [
          eb('timestamp', '<', dateRange.to.toDate()),
          dateRange.from && eb('timestamp', '>=', dateRange.from.toDate()),
          // do not delete daily
          eb(sql`extract(hour from "timestamp")`, '!=', 0),
          // delete only six hourly
          eb(sql`extract(hour from "timestamp") % 6`, '=', 0),
        ].filter(notUndefined),
      ),
    )
    .execute()
}
