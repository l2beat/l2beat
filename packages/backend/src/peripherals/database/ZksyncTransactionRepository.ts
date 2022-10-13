import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { ZksyncTransactionRow } from 'knex/types/tables'
import _ from 'lodash'

import { assert } from '../../tools/assert'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface ZksyncTransactionRecord {
  blockNumber: number
  blockIndex: number
  timestamp: UnixTime
}

interface RawBlockNumberQueryResult {
  rows: {
    no_next_block_number: number | null
    no_prev_block_number: number | null
  }[]
}

export class ZksyncTransactionRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.getBlockCount = this.wrapAny(this.getBlockCount)
    this.getMaxBlock = this.wrapAny(this.getMaxBlock)

    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: ZksyncTransactionRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('transactions.zksync').insert(row)
    return `${row.block_number}-${row.block_index}`
  }

  async addMany(records: ZksyncTransactionRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transactions.zksync').insert(rows)
    return rows.length
  }

  // Returns an array of half open intervals [) that include all missing block numbers
  async getMissingRanges() {
    const knex = await this.knex()

    const blockNumbers = (await knex.raw(
      `
      WITH 
        blocks AS (
          SELECT DISTINCT block_number FROM transactions.zksync
        ),
        no_next AS (
          SELECT 
            blocks.block_number
          FROM blocks 
          LEFT JOIN blocks b2 ON blocks.block_number  = b2.block_number - 1
          WHERE b2.block_number IS NULL
        ),
        no_prev AS (
          SELECT 
            blocks.block_number
          FROM blocks 
          LEFT JOIN blocks b2 ON blocks.block_number = b2.block_number + 1
          WHERE b2.block_number IS NULL
        )
      SELECT 
        no_prev.block_number as no_prev_block_number, 
        NULL as no_next_block_number
      FROM no_prev 
      UNION
      SELECT 
        NULL as no_prev_block_number, 
        no_next.block_number as no_next_block_number
      FROM no_next
      ORDER BY no_prev_block_number, no_next_block_number ASC
  `,
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
    await knex.schema.refreshMaterializedView('transactions.zksync_count_view')
  }

  async getDailyTransactionCount(
    maxTimestamp: UnixTime,
  ): Promise<{ timestamp: UnixTime; count: number }[]> {
    const knex = await this.knex()
    const rows = await knex('transactions.zksync_count_view')
      .where('unix_timestamp', '<', maxTimestamp.toDate())
      .orderBy('unix_timestamp')

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      count: Number(r.count),
    }))
  }

  async getAll() {
    const knex = await this.knex()
    const rows = await knex('transactions.zksync').select()
    return rows.map(toRecord)
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('transactions.zksync').delete()
  }

  async getMaxBlock(): Promise<number> {
    const knex = await this.knex()
    const [{ max }] = await knex('transactions.zksync').max('block_number')
    return max as number
  }

  async getBlockCount(): Promise<number> {
    const knex = await this.knex()
    const [{ count }] = await knex('transactions.zksync').countDistinct(
      'block_number',
    )
    return Number(count)
  }
}

function toRow(record: ZksyncTransactionRecord): ZksyncTransactionRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    block_index: record.blockIndex,
  }
}

function toRecord(row: ZksyncTransactionRow): ZksyncTransactionRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    blockNumber: row.block_number,
    blockIndex: row.block_index,
  }
}
