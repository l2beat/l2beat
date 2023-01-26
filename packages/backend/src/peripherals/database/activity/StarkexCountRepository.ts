import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { Knex } from 'knex'
import { StarkexTransactionCountRow } from 'knex/types/tables'

import { Metrics } from '../../../Metrics'
import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'
import { NullableDict } from '../shared/types'

export interface StarkexTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}

export class StarkexTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger, metrics: Metrics) {
    super(database, logger, metrics)
    this.autoWrap<CheckConvention<StarkexTransactionCountRepository>>(this)
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

  async findLastTimestampByProjectId(
    projectId: ProjectId,
  ): Promise<UnixTime | undefined> {
    const knex = await this.knex()
    // note: we need to provide better types manually here
    const row = (await knex('activity.starkex')
      .where('project_id', projectId.toString())
      .max('unix_timestamp')
      .first()) as NullableDict<Date> | undefined

    if (!row || row.max === null) {
      return undefined
    }

    return UnixTime.fromDate(row.max)
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
