import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { ZksyncTransactionRow } from 'knex/types/tables'

import { assert } from '../../tools/assert'
import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'
import {
  Boundaries,
  extractTipNumber,
  Gap,
  toExpandedGaps,
} from './transactionCountTip'

export interface ZksyncTransactionRecord {
  blockNumber: number
  blockIndex: number
  timestamp: UnixTime
}

export class ZksyncTransactionRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */
    this.addMany = this.wrapAddMany(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    this.refreshDailyCounts = this.wrapAny(this.refreshDailyCounts)
    this.getDailyCounts = this.wrapGet(this.getDailyCounts)
    this.getGaps = this.wrapGet(this.getGaps)
    this.refreshTip = this.wrapAny(this.refreshTip)
    this.getGapsAndBoundaries = this.wrapAny(this.getGapsAndBoundaries)
    this.findTip = this.wrapFind(this.findTip)
    this.updateTipByBlockNumber = this.wrapAny(this.updateTipByBlockNumber)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async addMany(records: ZksyncTransactionRecord[]) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await knex('transactions.zksync').insert(rows)
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    await knex('transactions.zksync_tip').delete()
    return await knex('transactions.zksync').delete()
  }

  async refreshDailyCounts() {
    await this.refreshTip()
    const knex = await this.knex()
    await knex.schema.refreshMaterializedView('transactions.zksync_count_view')
  }

  async getDailyCounts(): Promise<{ timestamp: UnixTime; count: number }[]> {
    const knex = await this.knex()
    const rows = await knex('transactions.zksync_count_view').orderBy(
      'unix_timestamp',
    )

    return rows.map((r) => ({
      timestamp: UnixTime.fromDate(r.unix_timestamp),
      count: Number(r.count),
    }))
  }

  async getGaps(first: number, last: number): Promise<Gap[]> {
    const { boundaries, gaps } = await this.refreshTip()
    return toExpandedGaps(first, last, gaps, boundaries)
  }

  private async refreshTip() {
    const { boundaries, gaps } = await this.getGapsAndBoundaries()
    const tipBlockNumber = extractTipNumber(gaps, boundaries)
    await this.updateTipByBlockNumber(tipBlockNumber)
    return { boundaries, gaps }
  }

  private async getGapsAndBoundaries(): Promise<{
    gaps: Gap[]
    boundaries?: Boundaries
  }> {
    const knex = await this.knex()
    const tip = await this.findTip()
    const { rows } = (await knex.raw(
      `
      SELECT NULL AS prev, min(block_number) AS next FROM transactions.zksync
      UNION
      SELECT block_number AS prev, next
      FROM (
        SELECT
          block_number,
          lead(block_number) over (order by block_number) AS next
        FROM transactions.zksync WHERE block_number >= :blockNumber
      ) with_lead
      WHERE next > block_number + 1 OR next IS NULL
      ORDER BY next ASC`,
      {
        blockNumber: tip?.blockNumber ?? 0,
      },
    )) as unknown as { rows: { prev: number | null; next: number | null }[] }

    const min = rows.splice(0, 1)[0]?.next
    const max = rows.splice(-1, 1)[0]?.prev

    return {
      gaps: rows.map(({ prev, next }) => {
        assert(prev !== null && next !== null)
        return [prev + 1, next - 1]
      }),
      boundaries: min !== null && max !== null ? { min, max } : undefined,
    }
  }

  private async findTip() {
    const knex = await this.knex()
    const row = await knex('transactions.zksync_tip').first()
    return row ? toRecord(row) : undefined
  }

  private async updateTipByBlockNumber(blockNumber?: number) {
    const knex = await this.knex()
    await knex.transaction(async (trx) => {
      await trx('transactions.zksync_tip').delete()
      if (blockNumber) {
        await trx.raw(
          `
          INSERT INTO transactions.zksync_tip (block_number, block_index, unix_timestamp)
            SELECT block_number, block_index, unix_timestamp
            FROM transactions.zksync
            WHERE block_number = :blockNumber
            ORDER BY block_index DESC
            LIMIT 1
        `,
          { blockNumber },
        )
      }
    })
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
