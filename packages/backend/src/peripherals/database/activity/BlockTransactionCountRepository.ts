import { Logger, ProjectId, UnixTime } from '@l2beat/shared'
import { Knex } from 'knex'
import { BlockTransactionCountRow } from 'knex/types/tables'

import { Metrics } from '../../../Metrics'
import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface BlockTransactionCountRecord {
  projectId: ProjectId
  blockNumber: number
  count: number
  timestamp: UnixTime
}

export class BlockTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger, metrics: Metrics) {
    super(database, logger, metrics)
    this.autoWrap<CheckConvention<BlockTransactionCountRepository>>(this)
  }

  async addMany(
    records: BlockTransactionCountRecord[],
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    const rows = records.map(toRow)
    await knex('activity.block').insert(rows)
    return rows.length
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
}

function toRow(record: BlockTransactionCountRecord): BlockTransactionCountRow {
  return {
    unix_timestamp: record.timestamp.toDate(),
    project_id: record.projectId.toString(),
    block_number: record.blockNumber,
    count: record.count,
  }
}
