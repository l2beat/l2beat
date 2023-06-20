import { Logger } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Knex } from 'knex'
import { BlockTransactionCountRow } from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface BlockTransactionCountRecord {
  projectId: ProjectId
  blockNumber: number
  count: number
  timestamp: UnixTime
}

export class BlockTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    this.autoWrap<CheckConvention<BlockTransactionCountRepository>>(this)
  }

  async addOrUpdateMany(
    records: BlockTransactionCountRecord[],
    trx?: Knex.Transaction,
  ) {
    for (const record of records) {
      await this.addOrUpdate(record, trx)
    }
    return records.length
  }

  async addOrUpdate(
    record: BlockTransactionCountRecord,
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    await knex('activity.block')
      .insert(toRow(record))
      .onConflict(['project_id', 'block_number'])
      .merge()
    return `${record.projectId.toString()}-${record.blockNumber})}`
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('activity.block').delete()
  }

  async findLastTimestampByProjectId(
    projectId: ProjectId,
  ): Promise<UnixTime | undefined> {
    const knex = await this.knex()
    const row = await knex('activity.block')
      .where('project_id', projectId.toString())
      .orderBy('block_number', 'desc')
      .first()
    return row ? UnixTime.fromDate(row.unix_timestamp) : undefined
  }

  async getAll(): Promise<BlockTransactionCountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('activity.block')
    return rows.map(toRecord)
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

function toRecord(row: BlockTransactionCountRow): BlockTransactionCountRecord {
  return {
    projectId: ProjectId(row.project_id),
    blockNumber: row.block_number,
    count: row.count,
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}
