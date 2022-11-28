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

export class BlockTransactionCountRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.addMany = this.wrapAny(this.addMany)
    this.deleteAll = this.wrapDelete(this.deleteAll)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async addMany(
    records: BlockTransactionCountRecord[],
    trx?: Knex.Transaction,
  ) {
    const knex = await this.knex(trx)
    const rows = records.map(toRow)
    await knex('activity_v2.block').insert(rows)
    return rows.length
  }

  async deleteAll() {
    const knex = await this.knex()
    return await knex('activity_v2.block').delete()
  }

  async getLastTimestampByProjectId(
    projectId: ProjectId,
  ): Promise<UnixTime | undefined> {
    const knex = await this.knex()
    const row = await knex('activity_v2.block')
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
