import { notUndefined, UnixTime } from '@l2beat/shared-pure'
import { sql } from 'kysely'
import type { QueryBuilder } from '../kysely'
import type { DB } from '../kysely/generated/types'

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
export async function deleteHourlyUntil(
  db: QueryBuilder,
  tableName: TablesWithTimestamp,
  dateRange: CleanDateRange,
): Promise<number> {
  const result = await db
    .deleteFrom(tableName)
    .where((eb) =>
      eb.and(
        [
          eb('timestamp', '<', UnixTime.toDate(dateRange.to)),
          dateRange.from !== undefined
            ? eb('timestamp', '>=', UnixTime.toDate(dateRange.from))
            : undefined,
          // do not delete six hourly and daily
          eb(sql`extract(hour from "timestamp") % 6`, '!=', 0),
        ].filter(notUndefined),
      ),
    )
    .executeTakeFirst()
  return Number(result.numDeletedRows)
}

/**
 * WARNING: this method requires table to have timestamp column
 */
export async function deleteSixHourlyUntil(
  db: QueryBuilder,
  tableName: TablesWithTimestamp,
  dateRange: CleanDateRange,
): Promise<number> {
  const result = await db
    .deleteFrom(tableName)
    .where((eb) =>
      eb.and(
        [
          eb('timestamp', '<', UnixTime.toDate(dateRange.to)),
          dateRange.from !== undefined
            ? eb('timestamp', '>=', UnixTime.toDate(dateRange.from))
            : undefined,
          // do not delete daily
          eb(sql`extract(hour from "timestamp")`, '!=', 0),
          // delete only six hourly
          eb(sql`extract(hour from "timestamp") % 6`, '=', 0),
        ].filter(notUndefined),
      ),
    )
    .executeTakeFirst()
  return Number(result.numDeletedRows)
}
