import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

export interface CleanDateRange {
  from: UnixTime | undefined
  to: UnixTime
}

/**
 * WARNING: this method requires table to have timestamp column
 */
export function deleteHourlyUntil(
  knex: Knex,
  tableName: string,
  dateRange: CleanDateRange,
) {
  let query = knex(tableName)
    .where('timestamp', '<', dateRange.to.toDate())
    // do not delete six hourly and daily
    .andWhereRaw(`extract(hour from "timestamp") % 6 != 0`)

  if (dateRange.from) {
    query = query.andWhere('timestamp', '>=', dateRange.from.toDate())
  }

  return query.delete()
}

/**
 * WARNING: this method requires table to have timestamp column
 */
export function deleteSixHourlyUntil(
  knex: Knex,
  tableName: string,
  dateRange: CleanDateRange,
) {
  let query = knex(tableName)
    .where('timestamp', '<', dateRange.to.toDate())
    // do not delete daily
    .andWhereRaw(`extract(hour from "timestamp") != 0`)
    // delete only six hourly
    .andWhereRaw(`extract(hour from "timestamp") % 6 = 0`)

  if (dateRange.from) {
    query = query.andWhere('timestamp', '>=', dateRange.from.toDate())
  }

  return query.delete()
}
