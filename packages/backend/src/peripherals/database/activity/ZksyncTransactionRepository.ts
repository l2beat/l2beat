import { Logger } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { ZksyncTransactionRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface ZksyncTransactionRecord {
  blockNumber: number
  blockIndex: number
  timestamp: UnixTime
}

export class ZksyncTransactionRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<ZksyncTransactionRepository>>(this)
  }

  async addOrUpdateMany(
    records: ZksyncTransactionRecord[],
    trx?: Knex.Transaction,
  ) {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(record: ZksyncTransactionRecord, trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    await knex('activity.zksync')
      .insert(toRow(record))
      .onConflict(['block_number', 'block_index'])
      .merge()
    return `zksync-${record.blockNumber})}`
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('activity.zksync').delete()
  }

  async findLastTimestamp(): Promise<UnixTime | undefined> {
    const knex = await this.knex()
    const row = await knex('activity.zksync')
      .orderBy('block_number', 'desc')
      .orderBy('block_index', 'desc')
      .first()
    return row ? UnixTime.fromDate(row.unix_timestamp) : undefined
  }

  async getAll(): Promise<ZksyncTransactionRecord[]> {
    const knex = await this.knex()
    const rows = await knex('activity.zksync')
    return rows.map(toRecord)
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
    blockNumber: row.block_number,
    blockIndex: row.block_index,
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}
