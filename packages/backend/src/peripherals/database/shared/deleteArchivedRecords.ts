import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'

/**
 * WARNING: this method requires table to have unix_timestamp column
 */
export function _TVL_ONLY_deleteHourlyUntil(
  knex: Knex,
  tableName: string,
  timestamp: UnixTime,
) {
  return (
    knex(tableName)
      .where('unix_timestamp', '<', timestamp.toDate())
      // do not delete daily
      .andWhereRaw(`extract(hour from "unix_timestamp") != 0`)
      // do not delete six hourly
      .andWhereRaw(`extract(hour from "unix_timestamp") % 6 != 0`)
      .delete()
  )
}

/**
 * WARNING: this method requires table to have unix_timestamp column
 */
export function _TVL_ONLY_deleteSixHourlyUntil(
  knex: Knex,
  tableName: string,
  timestamp: UnixTime,
) {
  return (
    knex(tableName)
      .where('unix_timestamp', '<', timestamp.toDate())
      // do not delete daily
      .andWhereRaw(`extract(hour from "unix_timestamp") != 0`)
      // delete only six hourly
      .andWhereRaw(`extract(hour from "unix_timestamp") % 6 = 0`)
      .delete()
  )
}
