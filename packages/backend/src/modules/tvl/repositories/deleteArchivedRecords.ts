import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

/**
 * WARNING: this method requires table to have unix_timestamp column
 */
export function deleteHourlyUntil(
  knex: Knex,
  tableName: string,
  to: UnixTime,
  from: UnixTime | undefined,
) {
  let query = knex(tableName)
    .where('unix_timestamp', '<', to.toDate())
    // do not delete six hourly and daily
    .andWhereRaw(`extract(hour from "unix_timestamp") % 6 != 0`)
    .delete()

  if (from) {
    query = query.andWhere('unix_timestamp', '>=', from.toDate())
  }

  return query
}

/**
 * WARNING: this method requires table to have unix_timestamp column
 */
export function deleteSixHourlyUntil(
  knex: Knex,
  tableName: string,
  to: UnixTime,
  from: UnixTime | undefined,
) {
  let query = knex(tableName)
    .where('unix_timestamp', '<', to.toDate())
    // do not delete daily
    .andWhereRaw(`extract(hour from "unix_timestamp") != 0`)
    // delete only six hourly
    .andWhereRaw(`extract(hour from "unix_timestamp") % 6 = 0`)
    .delete()

  if (from) {
    query = query.andWhere('unix_timestamp', '>=', from.toDate())
  }

  return query
}
