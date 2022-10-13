import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { BlockTransactionCountRow } from 'knex/types/tables'
import _ from 'lodash'

import { assert } from '../../tools/assert'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface BlockTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  blockNumber: number
  count: number
}
interface RawBlockNumberQueryResult {
  rows: {
    no_next_block_number: number | null
    no_prev_block_number: number | null
  }[]
}

export class BlockTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.getDailyTransactionCount = this.wrapGet(this.getDailyTransactionCount)
    this.getMaxBlock = this.wrapAny(this.getMaxBlock)
    this.getBlockCount = this.wrapAny(this.getBlockCount)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: BlockTransactionCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('transactions.block').insert(row)
    return `${row.project_id}-${row.block_number}`
  }

  async addMany(records: BlockTransactionCountRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transactions.block').insert(rows)
    return rows.length
  }

  // Returns an array of half open intervals [) that include all missing block numbers
  async getMissingRangesByProject(projectId: ProjectId) {
    const knex = await this.knex()

    const blockNumbers = (await knex.raw(
      `
      WITH 
        project_blocks AS (
          SELECT * FROM transactions.block WHERE project_id=?
        ),
        no_next AS (
          SELECT 
            project_blocks.block_number
          FROM project_blocks 
          LEFT JOIN project_blocks b2 ON project_blocks.block_number  = b2.block_number - 1
          WHERE b2.block_number IS NULL
        ),
        no_prev AS (
          SELECT 
            project_blocks.block_number 
          FROM project_blocks 
          LEFT JOIN project_blocks b2 ON project_blocks.block_number = b2.block_number + 1
          WHERE b2.block_number IS NULL
        )
      SELECT no_prev.block_number as no_prev_block_number, NULL as no_next_block_number
      FROM no_prev 
      UNION
      SELECT NULL as no_prev_block_number, no_next.block_number as no_next_block_number
      FROM no_next
      ORDER BY no_prev_block_number, no_next_block_number ASC
      `,
      projectId.toString(),
    )) as unknown as RawBlockNumberQueryResult

    const noPrevBlockNumbers = blockNumbers.rows.reduce<number[]>(
      (acc, row) => {
        if (row.no_prev_block_number !== null) {
          acc.push(row.no_prev_block_number)
        }
        return acc
      },
      [],
    )

    const noNextBlockNumbers = blockNumbers.rows.reduce<number[]>(
      (acc, row) => {
        if (row.no_next_block_number !== null) {
          acc.push(row.no_next_block_number + 1)
        }
        return acc
      },
      [],
    )

    noPrevBlockNumbers.push(Infinity)
    noNextBlockNumbers.unshift(-Infinity)

    assert(noNextBlockNumbers.length === noPrevBlockNumbers.length)

    return _.zip(noNextBlockNumbers, noPrevBlockNumbers) as [number, number][]
  }

  async refreshDailyTransactionCount() {
    const knex = await this.knex()
    await knex.schema.refreshMaterializedView('transactions.block_count_view')
  }

  async getDailyTransactionCount(
    projectId: ProjectId,
    maxTimestamp: UnixTime,
  ): Promise<{ timestamp: UnixTime; count: number }[]> {
    const knex = await this.knex()
    const rows = await knex('transactions.block_count_view')
      .where('project_id', projectId.toString())
      .andWhere('unix_timestamp', '<', maxTimestamp.toDate())
      .orderBy('unix_timestamp')

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      count: Number(r.count),
    }))
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('transactions.block').delete()
  }

  async getMaxBlock(projectId: ProjectId): Promise<number> {
    const knex = await this.knex()
    const [{ max }] = await knex('transactions.block')
      .max('block_number')
      .where('project_id', projectId.toString())
    return max
  }

  async getBlockCount(projectId: ProjectId): Promise<number> {
    const knex = await this.knex()
    const [{ count }] = await knex('transactions.block')
      .count()
      .where('project_id', projectId.toString())
    return Number(count)
  }
}

function toRow(record: BlockTransactionCountRecord): BlockTransactionCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}
