import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { TxCountRow } from 'knex/types/tables'
import _ from 'lodash'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface TxCountRecord {
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

export class TxCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: TxCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('tx_count').insert(row)
    return `${row.project_id}-${row.block_number}`
  }

  async addMany(records: TxCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('tx_count').insert(rows)
    return rows.length
  }

  async findLatestByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const row = await knex('tx_count')
      .where('project_id', projectId.toString())
      .orderBy('block_number', 'desc')
      .first()

    return row ? toRecord(row) : undefined
  }

  // Returns an array of half open intervals [) that include all missing block numbers
  async getMissingRangesByProject(projectId: ProjectId) {
    const knex = await this.knex()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const noNext = (await knex.raw(`
      WITH 
        project_blocks AS (
          SELECT * FROM tx_count WHERE project_id='${projectId.toString()}'
        )
      SELECT * 
      FROM (
        SELECT project_blocks.block_number 
        FROM project_blocks 
        LEFT JOIN project_blocks b2 ON project_blocks.block_number  = b2.block_number - 1
        WHERE b2.block_number IS NULL) AS no_next
      ORDER BY block_number ASC
    `)) as unknown as RawBlockNumberQueryResult

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const noPrev = (await knex.raw(`
      WITH 
          project_blocks AS (
            SELECT * FROM tx_count WHERE project_id='${projectId.toString()}'
          )
        SELECT * 
        FROM (
          SELECT project_blocks.block_number 
          FROM project_blocks 
          LEFT JOIN project_blocks b2 ON project_blocks.block_number = b2.block_number + 1
          WHERE b2.block_number IS NULL) AS no_prev
        ORDER BY block_number ASC
    `)) as unknown as RawBlockNumberQueryResult

    const noPrevBlockNumbers = noPrev.rows.map((row) => row.block_number)
    const noNextBlockNumbers = noNext.rows.map((row) => row.block_number + 1)

    noPrevBlockNumbers.push(Infinity)
    noNextBlockNumbers.unshift(-Infinity)

    if (noNextBlockNumbers.length !== noPrevBlockNumbers.length) {
      throw new Error('Arrays length should be the same')
    }

    return _.zip(noNextBlockNumbers, noPrevBlockNumbers) as [number, number][]
  }

  async getBlockNumbersByProject(projectId: ProjectId) {
    const knex = await this.knex()
    const rows = await knex('tx_count')
      .where('project_id', projectId.toString())
      .select('block_number')
      .orderBy('block_number', 'desc')
    return rows.map((row) => row.block_number)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('tx_count').delete()
  }
}

function toRow(record: TxCountRecord): TxCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}

function toRecord(row: TxCountRow): TxCountRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    blockNumber: row.block_number,
    count: row.count,
  }
}
