import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { Knex } from 'knex'
import { ZksyncTransactionRow } from 'knex/types/tables'

import { Metrics } from '../../../Metrics'
import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface ZksyncTransactionRecord {
  blockNumber: number
  blockIndex: number
  timestamp: UnixTime
}

export class ZksyncTransactionRepository extends BaseRepository {
  constructor(database: Database, logger: Logger, metrics: Metrics) {
    super(database, logger, metrics)
    this.autoWrap<CheckConvention<ZksyncTransactionRepository>>(this)
  }

  async addMany(records: ZksyncTransactionRecord[], trx?: Knex.Transaction) {
    const knex = await this.knex(trx)
    const rows = records.map(toRow)
    await knex('activity.zksync').insert(rows)
    return rows.length
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
}

function toRow(record: ZksyncTransactionRecord): ZksyncTransactionRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    block_number: record.blockNumber,
    block_index: record.blockIndex,
  }
}
