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

export class StarkexTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.addOrUpdateMany = this.wrapAny(this.addOrUpdateMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async addOrUpdateMany(
    records: StarkexTransactionCountRecord[],
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    const rows = records.map(toRow)
    await knex('activity.starkex')
      .insert(rows)
      .onConflict(['project_id', 'unix_timestamp'])
      .merge()
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('activity.starkex').delete()
  }

  async getLastTimestampByProjectId(
    projectId: ProjectId,
  ): Promise<UnixTime | undefined> {
    const knex = await this.knex()
    const row = await knex('activity.starkex')
      .where('project_id', projectId.toString())
      .max('unix_timestamp')
      .first()
    return row ? UnixTime.fromDate(row.max) : undefined
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
