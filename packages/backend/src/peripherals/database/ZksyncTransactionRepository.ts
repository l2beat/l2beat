import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { ZksyncTransactionRow } from 'knex/types/tables'

import { BaseRepository } from './shared/BaseRepository'
import { Database } from './shared/Database'

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
    this.findBoundaries = this.wrapFind(this.findBoundaries)
    this.refreshDailyCounts = this.wrapAny(this.refreshDailyCounts)
    this.getDailyCounts = this.wrapGet(this.getDailyCounts)
    this.getGaps = this.wrapGet(this.getGaps)
    this.findTip = this.wrapFind(this.findTip)
    this.refreshTip = this.wrapAny(this.refreshTip)
    this.findFreshTip = this.wrapFind(this.findFreshTip)
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

  async findBoundaries(): Promise<{ min: number; max: number } | undefined> {
    const knex = await this.knex()
    const row = (await knex('transactions.zksync')
      .min('block_number')
      .max('block_number')
      .first()) as { min: null | number; max: null | number }
    return row.min !== null && row.max !== null
      ? { min: row.min, max: row.max }
      : undefined
  }
  async refreshDailyCounts() {
    const knex = await this.knex()
    await this.refreshTip()
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

  async getGaps(): Promise<[number, number][]> {
    const knex = await this.knex()
    const tip = await this.refreshTip()
    const { rows } = (await knex.raw(
      `
      SELECT block_number + 1 start, next - 1 end
      FROM (
        SELECT
          block_number,
          lead(block_number) over (order by block_number) next
        FROM transactions.zksync where block_number >= :blockNumber
      ) with_lead
      WHERE next > block_number + 1`,
      {
        blockNumber: tip?.blockNumber ?? 0,
      },
    )) as unknown as { rows: { start: number; end: number }[] }
    return rows.map(({ start, end }) => [start, end])
  }

  async findTip() {
    const knex = await this.knex()
    const row = await knex('transactions.zksync_tip').first()
    return row ? toRecord(row) : undefined
  }

  private async refreshTip() {
    const knex = await this.knex()
    const currentTip = await this.findTip()
    const freshTip = await this.findFreshTip(currentTip?.blockNumber)

    await knex('transactions.zksync_tip').delete()
    if (freshTip) {
      await knex('transactions.zksync_tip').insert(toRow(freshTip))
    }
    return freshTip
  }

  private async findFreshTip(scanFrom = 0) {
    const knex = await this.knex()
    const blockNumberQuery = knex.raw(
      `
      SELECT min(block_number)
      FROM (
        SELECT
          block_number,
          lead(block_number) over (order by block_number) next
        FROM transactions.zksync where block_number >= :blockNumber
      ) with_lead
      WHERE next > block_number + 1 OR next IS NULL`,
      {
        blockNumber: scanFrom,
      },
    )
    const row = await knex('transactions.zksync')
      .andWhere('block_number', blockNumberQuery.wrap('(', ')'))
      .orderBy('block_index', 'desc')
      .first()

    return row ? toRecord(row) : undefined
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
