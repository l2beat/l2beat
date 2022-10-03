import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { RpcTransactionCountRow } from 'knex/types/tables'
import _ from 'lodash'

import { assert } from '../../tools/assert'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface RpcTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  blockNumber: number
  count: number
}
interface RawBlockNumberQueryResult {
  rows: {
    no_next_block_number: number
    no_prev_block_number: number
  }[]
}

export class RpcTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.getDailyTransactionCount = this.wrapGet(this.getDailyTransactionCount)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: RpcTransactionCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('transactions.rpc').insert(row)
    return `${row.project_id}-${row.block_number}`
  }

  async addMany(records: RpcTransactionCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transactions.rpc').insert(rows)
    return rows.length
  }

  // Returns an array of half open intervals [) that include all missing block numbers
  async getMissingRangesByProject(projectId: ProjectId) {
    const knex = await this.knex()

    const blockNumbers = (await knex.raw(
      `
      WITH 
        project_blocks AS (
          SELECT * FROM transactions.rpc WHERE project_id=?
        ),
        no_next AS (
          SELECT 
            project_blocks.block_number, 
            row_number() 
              OVER (ORDER BY project_blocks.block_number) 
              AS row_num
          FROM project_blocks 
          LEFT JOIN project_blocks b2 ON project_blocks.block_number  = b2.block_number - 1
          WHERE b2.block_number IS NULL
        ),
        no_prev AS (
          SELECT 
            project_blocks.block_number,
            row_number() 
              OVER (ORDER BY project_blocks.block_number) 
              AS row_num
          FROM project_blocks 
          LEFT JOIN project_blocks b2 ON project_blocks.block_number = b2.block_number + 1
          WHERE b2.block_number IS NULL
        )
      SELECT 
        no_prev.block_number as no_prev_block_number, 
        no_next.block_number as no_next_block_number
      FROM no_prev 
      JOIN no_next 
      ON no_prev.row_num = no_next.row_num
    `,
      projectId.toString(),
    )) as unknown as RawBlockNumberQueryResult

    const noPrevBlockNumbers = blockNumbers.rows.map(
      (row) => row.no_prev_block_number,
    )

    const noNextBlockNumbers = blockNumbers.rows.map(
      (row) => row.no_next_block_number + 1,
    )

    noPrevBlockNumbers.push(Infinity)
    noNextBlockNumbers.unshift(-Infinity)

    assert(noNextBlockNumbers.length === noPrevBlockNumbers.length)

    return _.zip(noNextBlockNumbers, noPrevBlockNumbers) as [number, number][]
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
        transactions.rpc
      WHERE
        project_id = ?
      GROUP BY
        project_id,
        date_trunc('day', unix_timestamp, 'UTC')
    `,
      projectId.toString(),
    )) as unknown as {
      rows: Pick<RpcTransactionCountRow, 'unix_timestamp' | 'count'>[]
    }

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      count: Number(r.count),
    }))
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('transactions.rpc').delete()
  }
}

function toRow(record: RpcTransactionCountRecord): RpcTransactionCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}
