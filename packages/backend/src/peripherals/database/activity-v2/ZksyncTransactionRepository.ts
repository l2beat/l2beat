import { Logger } from '@l2beat/common'
import { UnixTime } from '@l2beat/types'
import { Knex } from 'knex'
import { ZksyncTransactionRow } from 'knex/types/tables'

import { BaseRepository } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface ZksyncTransactionRecord {
  blockNumber: number
  blockIndex: number
  timestamp: UnixTime
}

export class ZksyncTransactionRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)

    /* eslint-disable @typescript-eslint/unbound-method */
    this.addOrUpdateMany = this.wrapAddMany(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async addOrUpdateMany(
    records: ZksyncTransactionRecord[],
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await (trx ?? knex)('transactions.zksync')
      .insert(rows)
      .onConflict(['block_number', 'block_index'])
      .merge()
    return rows.length
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
