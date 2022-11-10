import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { Knex } from 'knex'
import { BlockCountRow } from 'knex/types/tables'

import { BaseRepository } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface BlockCountRecord {
  projectId: ProjectId
  blockNumber: number
  count: number
  timestamp: UnixTime
}

export class BlockCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.addOrUpdateMany = this.wrapAny(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async addOrUpdateMany(records: BlockCountRecord[], trx?: Knex.Transaction) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await (trx ?? knex)('transactions.block')
      .insert(rows)
      .onConflict(['project_id', 'block_number'])
      .merge()
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('transactions.block').delete()
  }
}

function toRow(record: BlockCountRecord): BlockCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}
