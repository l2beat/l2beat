import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { Knex } from 'knex'
import { StarkexTransactionCountRow } from 'knex/types/tables'

import { BaseRepository } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface StarkexTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}

export class StarkexRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.add = this.wrapAdd(this.add)
    this.addOrUpdateMany = this.wrapAny(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async add(record: StarkexTransactionCountRecord) {
    const knex = await this.knex()
    const row = toRow(record)
    await knex('transactions.starkex').insert(row)
    return `${row.project_id}-${row.unix_timestamp.toDateString()}`
  }

  async addOrUpdateMany(
    records: StarkexTransactionCountRecord[],
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex()
    const rows = records.map(toRow)
    await (trx ?? knex)('transactions.starkex')
      .insert(rows)
      .onConflict(['project_id', 'unix_timestamp'])
      .merge()
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('transactions.starkex').delete()
  }
}

function toRow(
  record: StarkexTransactionCountRecord,
): StarkexTransactionCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    count: record.count,
  }
}
