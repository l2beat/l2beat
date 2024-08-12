import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { sql } from 'kysely'
import { BaseRepository } from '../../BaseRepository'
import { DailyTransactionCountRecord, toRecord } from './entity'

export class ActivityViewRepository extends BaseRepository {
  async refresh(): Promise<void> {
    await sql`
      REFRESH MATERIALIZED VIEW CONCURRENTLY activity.daily_count_view
    `.execute(this.db)
  }

  async getDailyCounts(): Promise<DailyTransactionCountRecord[]> {
    const rows = await this.db
      .selectFrom('activity.daily_count_view')
      .select(['project_id', 'count', 'unix_timestamp'])
      .orderBy('unix_timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getDailyCountsForProjectsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime, UnixTime],
  ): Promise<DailyTransactionCountRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('activity.daily_count_view')
      .select(['project_id', 'count', 'unix_timestamp'])
      .where('unix_timestamp', '>=', from.toDate())
      .where('unix_timestamp', '<', to.toDate())
      .where(
        'project_id',
        'in',
        projectIds.map((id) => id.toString()),
      )
      .orderBy('unix_timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getSummedCountForProjectsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime, UnixTime],
  ): Promise<Omit<DailyTransactionCountRecord, 'timestamp'>[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('activity.daily_count_view')
      .select(['project_id'])
      .select((eb) => eb.fn.sum('count').as('count'))
      .where(
        'project_id',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('unix_timestamp', '>=', from.toDate())
      .where('unix_timestamp', '<', to.toDate())
      .groupBy('project_id')
      .execute()

    return rows.map((row) => ({
      projectId: ProjectId(row.project_id),
      count: Number(row.count),
    }))
  }

  async getDailyCountsPerProject(
    projectId: ProjectId,
  ): Promise<DailyTransactionCountRecord[]> {
    const rows = await this.db
      .selectFrom('activity.daily_count_view')
      .select(['project_id', 'count', 'unix_timestamp'])
      .where('project_id', '=', projectId.toString())
      .orderBy('unix_timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getProjectsAggregatedDailyCount(
    projectIds: ProjectId[],
  ): Promise<Omit<DailyTransactionCountRecord, 'projectId'>[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('activity.daily_count_view')
      .where(
        'project_id',
        'in',
        projectIds.map((id) => id.toString()),
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

  async getMaxCountForProjects() {
    const subquery = this.db
      .selectFrom('activity.daily_count_view')
      .select(['project_id', (eb) => eb.fn.max('count').as('max_count')])
      .groupBy('project_id')
      .as('t2')

    const rows = await this.db
      .selectFrom('activity.daily_count_view as t1')
      .innerJoin(subquery, (join) =>
        join
          .onRef('t1.project_id', '=', 't2.project_id')
          .onRef('t1.count', '=', 't2.max_count'),
      )
      .select(['t1.project_id', 't1.count as max_count', 't1.unix_timestamp'])
      .execute()

    return Object.fromEntries(
      rows.map((row) => [
        row.project_id,
        {
          count: Number(row.max_count),
          timestamp: UnixTime.fromDate(row.unix_timestamp),
        },
      ]),
    )
  }
}
