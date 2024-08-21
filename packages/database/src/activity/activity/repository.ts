import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../../BaseRepository'
import { ActivityRecord, toRecord, toRow } from './entity'
import { selectActivity } from './select'

export class ActivityRepository extends BaseRepository {
  async getAll(): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('public.activity')
      .select(selectActivity)
      .execute()
    return rows.map(toRecord)
  }

  async upsertMany(records: ActivityRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('public.activity')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'project_id']).doUpdateSet((eb) => ({
            count: eb.ref('excluded.count'),
            start: eb.ref('excluded.start'),
            end: eb.ref('excluded.end'),
          })),
        )
        .execute()
    })
    return records.length
  }

  async deleteByProjectIdFrom(
    projectId: ProjectId,
    fromInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('public.activity')
      .where((eb) =>
        eb.and([
          eb('project_id', '=', projectId.toString()),
          eb('timestamp', '>=', fromInclusive.toDate()),
        ]),
      )
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.activity')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
  ): Promise<ActivityRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('public.activity')
      .select(selectActivity)
      .where('project_id', '=', projectId.toString())
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getSummedCountForProjectsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime, UnixTime],
  ): Promise<Omit<ActivityRecord, 'timestamp' | 'start' | 'end'>[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('public.activity')
      .select(['project_id'])
      .select((eb) => eb.fn.sum('count').as('count'))
      .where(
        'project_id',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<', to.toDate())
      .groupBy('project_id')
      .execute()

    return rows.map((row) => ({
      projectId: ProjectId(row.project_id),
      count: Number(row.count),
    }))
  }

  /**
   * Returns all activity records for a project including the data point
   * @param projectId Id of a project
   * @param dataPoint Data point identifier (block, timestamp)
   */
  async getByProjectIncludingDataPoint(
    projectId: ProjectId,
    dataPoint: number,
  ): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('public.activity')
      .select(selectActivity)
      .where('project_id', '=', projectId.toString())
      .where('start', '<=', dataPoint)
      .where('end', '>=', dataPoint)
      .execute()

    return rows.map(toRecord)
  }

  async getDailyCounts(): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('public.activity')
      .select(selectActivity)
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getDailyCountsPerProject(
    projectId: ProjectId,
  ): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('public.activity')
      .select(selectActivity)
      .where('project_id', '=', projectId.toString())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getProjectsAggregatedDailyCount(
    projectIds: ProjectId[],
  ): Promise<Omit<ActivityRecord, 'projectId' | 'start' | 'end'>[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('public.activity')
      .where(
        'project_id',
        'in',
        projectIds.map((id) => id.toString()),
      )
      .select('timestamp')
      .select((eb) => eb.fn.sum('count').as('count'))
      .groupBy('timestamp')
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map((row) => ({
      count: Number(row.count),
      timestamp: UnixTime.fromDate(row.timestamp),
    }))
  }
}
