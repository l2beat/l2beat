import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import {
  TransactionCountBlockTipRow,
  ZksyncTransactionRow,
} from 'knex/types/tables'
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
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async addMany(records: ZksyncTransactionRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transactions.zksync').insert(rows)
    return rows.length
  }

  async refreshTip() {
    const knex = await this.knex()
    const currentTip = await this.getTip()
    const tipNumber =
      (await this.getFirstBlockNumberWithoutNext(currentTip?.block_number)) ??
      (await this.getMaxBlockNumber())

    if (!tipNumber) {
      await knex('transactions.block_tip')
        .delete()
        .where('project_id', ProjectId.ZKSYNC.toString())
      return undefined
    } else {
      const tip = await knex('transactions.zksync')
        .andWhere('block_number', tipNumber)
        .first()
      assert(tip, 'Calculated tip not found')
      await knex('transactions.block_tip')
        .insert({
          block_number: tipNumber,
          unix_timestamp: tip.unix_timestamp,
          project_id: ProjectId.ZKSYNC.toString(),
        })
        .onConflict('project_id')
        .merge(['block_number', 'unix_timestamp'])
      return {
        blockNumber: tip.block_number,
        timestamp: UnixTime.fromDate(tip.unix_timestamp),
      }
    }
  }

  // Returns an array of half open intervals [) that include all missing block numbers
  async getMissingRanges() {
    const knex = await this.knex()
    const tip = await this.getTip()

    const blockNumbers = (await knex.raw(
      `
      WITH 
        blocks AS (
          SELECT DISTINCT block_number FROM transactions.zksync WHERE block_number >= :blockNumber
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
      { blockNumber: tip?.block_number ?? 0 },
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

  async refreshFullySyncedDailyCounts() {
    const knex = await this.knex()
    await knex.schema.refreshMaterializedView('transactions.zksync_count_view')
  }

  async getFullySyncedDailyCounts(): Promise<
    { timestamp: UnixTime; count: number }[]
  > {
    const knex = await this.knex()
    const rows = await knex('transactions.zksync_count_view').orderBy(
      'unix_timestamp',
    )

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
    await knex('transactions.block_tip').delete()
    return await knex('transactions.zksync').delete()
  }

  async getTip() {
    const knex = await this.knex()
    return knex('transactions.block_tip')
      .where('project_id', ProjectId.ZKSYNC.toString())
      .first()
  }

  private async getMaxBlockNumber(): Promise<number | undefined> {
    const knex = await this.knex()
    const row = await knex('transactions.zksync').max('block_number').first()
    return row?.max
  }

  private async getFirstBlockNumberWithoutNext(scanFrom = 0) {
    const knex = await this.knex()
    const {
      rows: [noNext],
    } = (await knex.raw(
      `
      SELECT min(block_number) as block_number
      FROM (
        SELECT
          block_number,
          lead(block_number) over (order by block_number) as next
        FROM transactions.zksync where block_number >= :blockNumber
      ) with_lead
      WHERE next <> block_number + 1;
    `,
      {
        blockNumber: scanFrom,
      },
    )) as unknown as {
      rows: (Pick<TransactionCountBlockTipRow, 'block_number'> | undefined)[]
    }
    return noNext?.block_number
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
