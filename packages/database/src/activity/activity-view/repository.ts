import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { sql } from 'kysely'
import { BaseRepository } from '../../BaseRepository'
import { DailyTransactionCountRecord, toRecord } from './entity'

export class ActivityViewRepository extends BaseRepository {
  async refresh(): Promise<void> {
    await sql`
      REFRESH MATERIALIZED VIEW CONCURRENTLY activity.daily_count_view
    `.execute(this.getDb())
  }

  async getDailyCounts(): Promise<DailyTransactionCountRecord[]> {
    const rows = await this.getDb()
      .selectFrom('activity.daily_count_view')
      .select(['project_id', 'count', 'unix_timestamp'])
      .orderBy('unix_timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getDailyCountsPerProject(
    projectId: ProjectId,
  ): Promise<DailyTransactionCountRecord[]> {
    const rows = await this.getDb()
      .selectFrom('activity.daily_count_view')
      .select(['project_id', 'count', 'unix_timestamp'])
      .where('project_id', '=', projectId.toString())
      .orderBy('unix_timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getProjectsAggregatedDailyCount(
    projectIdsFilter: ProjectId[],
  ): Promise<Omit<DailyTransactionCountRecord, 'projectId'>[]> {
    if (projectIdsFilter.length === 0) {
      return []
    }

    const rows = await this.getDb()
      .selectFrom('activity.daily_count_view')
      .where(
        'project_id',
        'in',
        projectIdsFilter.map((id) => id.toString()),
      )
      .select('unix_timestamp')
      .select((eb) => eb.fn.sum('count').as('count'))
      .groupBy('unix_timestamp')
      .orderBy('unix_timestamp', 'asc')
      .execute()

    return rows.map((row) => ({
      count: Number(row.count),
      timestamp: UnixTime.fromDate(row.unix_timestamp),
    }))
  }
}
