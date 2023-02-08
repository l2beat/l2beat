import { Logger, ProjectId, UnixTime } from '@l2beat/shared'
import { DailyTransactionCountRow } from 'knex/types/tables'

import { Metrics } from '../../../Metrics'
import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface DailyTransactionCountRecord {
  projectId: ProjectId
  timestamp: UnixTime
  count: number
}

export class DailyTransactionCountViewRepository extends BaseRepository {
  constructor(database: Database, logger: Logger, metrics: Metrics) {
    super(database, logger, metrics)
    /* eslint-disable @typescript-eslint/unbound-method */
    this.refresh = this.wrapAny(this.refresh)
    /* eslint-enable @typescript-eslint/unbound-method */
    this.autoWrap<CheckConvention<DailyTransactionCountViewRepository>>(this)
  }

  async refresh(): Promise<void> {
    const knex = await this.knex()
    await knex.schema.refreshMaterializedView('activity.daily_count_view', true)
  }

  async getDailyCounts(): Promise<DailyTransactionCountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('activity.daily_count_view').orderBy(
      'unix_timestamp',
      'asc',
    )
    return rows.map(toRecord)
  }
}

function toRecord(row: DailyTransactionCountRow): DailyTransactionCountRecord {
  return {
    projectId: ProjectId(row.project_id),
    count: Number(row.count),
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}
