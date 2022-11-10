import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { Knex } from 'knex'
import { BlockTransactionCountRow } from 'knex/types/tables'

import { BaseRepository } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface BlockTransactionCountRecord {
  projectId: ProjectId
  blockNumber: number
  count: number
  timestamp: UnixTime
}

export class BlockRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.addOrUpdateMany = this.wrapAny(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async addOrUpdateMany(
    records: BlockTransactionCountRecord[],
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await (trx ?? knex)('transactions.block')
      .insert(rows)
      .onConflict(['project_id', 'unix_timestamp'])
      .merge()
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    await knex('transactions.block_tip').delete()
    return await knex('transactions.block').delete()
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
