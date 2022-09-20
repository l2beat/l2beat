import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { TransactionCountRow } from 'knex/types/tables'
import _ from 'lodash'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface TransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  blockNumber: number
  count: number
}
interface RawBlockNumberQueryResult {
  rows: {
    block_number: number
  }[]
}

export class TransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: TransactionCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('transaction_count').insert(row)
    return `${row.project_id}-${row.block_number}`
  }

  async addMany(records: TransactionCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transaction_count').insert(rows)
    return rows.length
  }

  // Returns an array of half open intervals [) that include all missing block numbers
  async getMissingRangesByProject(projectId: ProjectId) {
    const knex = await this.knex()

    const noNext = (await knex.raw(
      `
      WITH 
        project_blocks AS (
          SELECT * FROM transaction_count WHERE project_id=?
        )
      SELECT * 
      FROM (
        SELECT project_blocks.block_number 
        FROM project_blocks 
        LEFT JOIN project_blocks b2 ON project_blocks.block_number  = b2.block_number - 1
        WHERE b2.block_number IS NULL) AS no_next
      ORDER BY block_number ASC
    `,
      projectId.toString(),
    )) as unknown as RawBlockNumberQueryResult

    const noPrev = (await knex.raw(
      `
      WITH 
          project_blocks AS (
            SELECT * FROM transaction_count WHERE project_id=?
          )
        SELECT * 
        FROM (
          SELECT project_blocks.block_number 
          FROM project_blocks 
          LEFT JOIN project_blocks b2 ON project_blocks.block_number = b2.block_number + 1
          WHERE b2.block_number IS NULL) AS no_prev
        ORDER BY block_number ASC
    `,
      projectId.toString(),
    )) as unknown as RawBlockNumberQueryResult

    const noPrevBlockNumbers = noPrev.rows.map((row) => row.block_number)
    const noNextBlockNumbers = noNext.rows.map((row) => row.block_number + 1)

    noPrevBlockNumbers.push(Infinity)
    noNextBlockNumbers.unshift(-Infinity)

    if (noNextBlockNumbers.length !== noPrevBlockNumbers.length) {
      throw new Error('Arrays length should be the same')
    }

    return _.zip(noNextBlockNumbers, noPrevBlockNumbers) as [number, number][]
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('transaction_count').delete()
  }
}

function toRow(record: TransactionCountRecord): TransactionCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}
