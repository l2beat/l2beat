import { Logger } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { StarkexTransactionCountRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'
import { NullableDict } from '../shared/types'

export interface StarkexTransactionCountRecord {
  timestamp: UnixTime
  projectId: ProjectId
  count: number
}

export class StarkexTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<StarkexTransactionCountRepository>>(this)
  }

  async addOrUpdateMany(
    records: StarkexTransactionCountRecord[],
    trx?: Knex.Transaction,
  ) {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(
    record: StarkexTransactionCountRecord,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    await knex('activity.starkex')
      .insert(toRow(record))
      .onConflict(['project_id', 'unix_timestamp'])
      .merge()
    return `${record.projectId.toString()}-${record.timestamp.toString()})}`
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

  async getAll(): Promise<StarkexTransactionCountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('activity.starkex')
    return rows.map(toRecord)
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

function toRecord(
  row: StarkexTransactionCountRow,
): StarkexTransactionCountRecord {
  return {
    timestamp: UnixTime.fromDate(row.unix_timestamp),
    projectId: ProjectId(row.project_id),
    count: row.count,
  }
}
