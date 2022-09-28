import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { ZksyncTransactionRow } from 'knex/types/tables'
import _ from 'lodash'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

export interface ZksyncTransactionRecord {
  blockNumber: number
  blockIndex: number
  timestamp: UnixTime
}

interface RawBlockNumberQueryResult {
  rows: {
    block_number: number
  }[]
}

export class ZksyncTransactionRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */

    this.add = this.wrapAdd(this.add)
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)

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

    const noNext = (await knex.raw(
      `
      WITH 
        blocks AS (
          SELECT DISTINCT block_number FROM transactions.zksync 
        )
      SELECT * 
      FROM (
        SELECT blocks.block_number 
        FROM blocks 
        LEFT JOIN blocks b2 ON blocks.block_number  = b2.block_number - 1
        WHERE b2.block_number IS NULL) AS no_next
      ORDER BY block_number ASC
    `,
    )) as unknown as RawBlockNumberQueryResult

    const noPrev = (await knex.raw(
      `
      WITH 
        blocks AS (
          SELECT DISTINCT block_number FROM transactions.zksync 
        )
      SELECT * 
      FROM (
        SELECT blocks.block_number 
        FROM blocks 
        LEFT JOIN blocks b2 ON blocks.block_number  = b2.block_number + 1
        WHERE b2.block_number IS NULL) AS no_next
      ORDER BY block_number ASC
    `,
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

  async getDailyTransactionCount() {
    const knex = await this.knex()
    const { rows } = (await knex.raw(
      `
      SELECT
        date_trunc('day', unix_timestamp, 'UTC') AS unix_timestamp,
        count(*) as count
      FROM
        transactions.zksync
      GROUP BY
        date_trunc('day', unix_timestamp, 'UTC')
      ORDER BY unix_timestamp
    `,
    )) as unknown as {
      rows: { unix_timestamp: Date; count: string }[]
    }

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
