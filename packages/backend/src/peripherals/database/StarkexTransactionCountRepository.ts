import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { StarkexTransactionCountRow } from 'knex/types/tables'
import _ from 'lodash'

import { assert } from '../../tools/assert'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface StarkexTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}
interface RawBlockNumberQueryResult {
  rows: {
    no_prev_day: Date | null
    no_next_day: Date | null
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
    await knex('transactions.starkex').insert(row)
    return `${row.project_id}-${row.unix_timestamp.toDateString()}`
  }

  async addMany(records: StarkexTransactionCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transactions.starkex').insert(rows)
    return rows.length
  }

  // Returns an array of half open intervals [) that include all missing days
  // Day is unix_timestamp divided by 86400 (number of seconds in a day)
  async getMissingRangesByProject(projectId: ProjectId) {
    const knex = await this.knex()

    const days = (await knex.raw(
      `
      WITH 
        project_days AS (
          SELECT * FROM transactions.starkex WHERE project_id=?
        ),
        no_next AS (
          SELECT 
            project_days.unix_timestamp
          FROM project_days 
          LEFT JOIN project_days b2 ON project_days.unix_timestamp  = b2.unix_timestamp - INTERVAL '1 DAY'
          WHERE b2.unix_timestamp IS NULL
        ),
        no_prev AS (
          SELECT 
            project_days.unix_timestamp
          FROM project_days
          LEFT JOIN project_days b2 ON project_days.unix_timestamp = b2.unix_timestamp + INTERVAL '1 DAY'
          WHERE b2.unix_timestamp IS NULL
        )
      SELECT
        no_prev.unix_timestamp as no_prev_day, 
        NULL as no_next_day
      FROM no_prev 
      UNION
      SELECT
        NULL as no_prev_day, 
        no_next.unix_timestamp as no_next_day
      FROM no_next
      ORDER BY no_prev_day, no_next_day ASC
    `,
      projectId.toString(),
    )) as unknown as RawBlockNumberQueryResult

    const noPrevDay = days.rows.reduce<number[]>((acc, row) => {
      if (row.no_prev_day !== null) {
        acc.push(UnixTime.fromDate(row.no_prev_day).toDays())
      }
      return acc
    }, [])

    const noNextDay = days.rows.reduce<number[]>((acc, row) => {
      if (row.no_next_day !== null) {
        acc.push(UnixTime.fromDate(row.no_next_day).add(1, 'days').toDays())
      }
      return acc
    }, [])

    noPrevDay.push(Infinity)
    noNextDay.unshift(-Infinity)

    assert(noNextDay.length === noPrevDay.length)

    return _.zip(noNextDay, noPrevDay) as [number, number][]
  }

  async getDailyTransactionCount(
    projectId: ProjectId,
  ): Promise<{ timestamp: UnixTime; count: number }[]> {
    const knex = await this.knex()
    const { rows } = (await knex.raw(
      `
      SELECT
        date_trunc('day', unix_timestamp, 'UTC') AS unix_timestamp,
        sum(count) as count
      FROM
        transactions.starkex
      WHERE
        project_id = ?
      GROUP BY
        project_id,
        date_trunc('day', unix_timestamp, 'UTC')
      ORDER BY 
        unix_timestamp
    `,
      projectId.toString(),
    )) as unknown as {
      rows: Pick<StarkexTransactionCountRow, 'unix_timestamp' | 'count'>[]
    }

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      count: Number(r.count),
    }))
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('transactions.starkex').delete()
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
