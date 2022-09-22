import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { StarkexTransactionCountRow } from 'knex/types/tables'
import _ from 'lodash'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface StarkexTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}
interface RawBlockNumberQueryResult {
  rows: {
    unix_timestamp: Date
  }[]
}

export class StarkexTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: StarkexTransactionCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('starkex_transaction_count').insert(row)
    return `${row.project_id}-${row.unix_timestamp.toDateString()}`
  }

  async addMany(records: StarkexTransactionCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('starkex_transaction_count').insert(rows)
    return rows.length
  }

  // Returns an array of half open intervals [) that include all missing days
  // Day is unix_timestamp divided by 86400 (number of seconds in a day)
  async getMissingRangesByProject(projectId: ProjectId) {
    const knex = await this.knex()

    const noNext = (await knex.raw(
      `
      WITH 
        project_days AS (
          SELECT * FROM starkex_transaction_count WHERE project_id=?
        )
      SELECT * 
      FROM (
        SELECT project_days.unix_timestamp 
        FROM project_days 
        LEFT JOIN project_days b2 ON project_days.unix_timestamp  = b2.unix_timestamp - INTERVAL '1 DAY'
        WHERE b2.unix_timestamp IS NULL) AS no_next
      ORDER BY unix_timestamp ASC
    `,
      projectId.toString(),
    )) as unknown as RawBlockNumberQueryResult

    const noPrev = (await knex.raw(
      `
      WITH 
          project_days AS (
            SELECT * FROM starkex_transaction_count WHERE project_id=?
          )
        SELECT * 
        FROM (
          SELECT project_days.unix_timestamp 
          FROM project_days 
          LEFT JOIN project_days b2 ON project_days.unix_timestamp = b2.unix_timestamp + INTERVAL '1 DAY'
          WHERE b2.unix_timestamp IS NULL) AS no_prev
        ORDER BY unix_timestamp ASC
    `,
      projectId.toString(),
    )) as unknown as RawBlockNumberQueryResult

    const noPrevDay = noPrev.rows.map((row) =>
      UnixTime.fromDate(row.unix_timestamp).toDays(),
    )
    const noNextDay = noNext.rows.map((row) =>
      UnixTime.fromDate(row.unix_timestamp).add(1, 'days').toDays(),
    )

    noPrevDay.push(Infinity)
    noNextDay.unshift(-Infinity)

    if (noNextDay.length !== noPrevDay.length) {
      throw new Error('Arrays length should be the same')
    }

    return _.zip(noNextDay, noPrevDay) as [number, number][]
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('starkex_transaction_count').delete()
  }
}

function toRow(
  record: StarkexTransactionCountRecord,
): StarkexTransactionCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    count: record.count,
  }
}
