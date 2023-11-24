import { Logger } from '@l2beat/backend-tools'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  DailyTransactionCountRow,
  ProjectsAggregatedDailyCountRow,
} from 'knex/types/tables'

import { BaseRepository, CheckConvention } from '../shared/BaseRepository'
import { Database } from '../shared/Database'

export interface DailyTransactionCountRecord {
  projectId: ProjectId
  timestamp: UnixTime
  count: number
}

export type ProjectsAggregatedDailyTransactionCounts = Pick<
  DailyTransactionCountRecord,
  'timestamp' | 'count'
>

export class DailyTransactionCountViewRepository extends BaseRepository {
  constructor(database: Database, logger: Logger) {
    super(database, logger)
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

  async getDailyCountsPerProject(
    projectId: ProjectId,
  ): Promise<DailyTransactionCountRecord[]> {
    const knex = await this.knex()
    const rows = await knex('activity.daily_count_view')
      .where('project_id', projectId.toString())
      .orderBy('unix_timestamp', 'asc')
    return rows.map(toRecord)
  }

  async getProjectsAggregatedDailyCount(
    projectIdsFilter: ProjectId[],
  ): Promise<ProjectsAggregatedDailyTransactionCounts[]> {
    const knex = await this.knex()
    const rows = await knex('activity.daily_count_view')
      .whereIn(
        'project_id',
        projectIdsFilter.map((id) => id.toString()),
      )
      .select('unix_timestamp')
      .sum('count as count')
      .groupBy('unix_timestamp')
      .orderBy('unix_timestamp', 'asc')
    return (rows as unknown as ProjectsAggregatedDailyCountRow[]).map(
      toProjectsAggregatedRecord,
    )
  }
}

function toRecord(row: DailyTransactionCountRow): DailyTransactionCountRecord {
  return {
    projectId: ProjectId(row.project_id),
    count: Number(row.count),
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}

function toProjectsAggregatedRecord(
  row: ProjectsAggregatedDailyCountRow,
): ProjectsAggregatedDailyTransactionCounts {
  return {
    count: Number(row.count),
    timestamp: UnixTime.fromDate(row.unix_timestamp),
  }
}
