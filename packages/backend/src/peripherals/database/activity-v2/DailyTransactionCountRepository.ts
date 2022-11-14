import { Logger } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { DailyTransactionCountRow } from 'knex/types/tables'

import { BaseRepository } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface DailyTransactionCountRecord {
  projectId: ProjectId
  timestamp: UnixTime
  count: number
}

export class DailyTransactionCountViewRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.refresh = this.wrapAny(this.refresh)
    this.getDailyCounts = this.wrapGet(this.getDailyCounts)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  async refresh(): Promise<void> {
    const knex = await this.knex()
    await knex.schema.refreshMaterializedView(
      'activity_v2.daily_count_view',
      true,
    )
  }

  async getDailyCounts(): Promise<DailyTransactionCountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('activity_v2.daily_count_view').orderBy(
      'unix_timestamp',
      'asc',
    )
    return rows.map(toRecord)
  }
}

function toRecord(row: DailyTransactionCountRow): DailyTransactionCountRecord {
  return {
    projectId: ProjectId(row.project_id),
    count: row.count,
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}
