import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BaseRepository } from '../BaseRepository'
import { ActivityRecord, toRecord, toRow } from './entity'
import { selectActivity } from './select'

export class ActivityRepository extends BaseRepository {
  async getAll(): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('Activity')
      .select(selectActivity)
      .execute()
    return rows.map(toRecord)
  }

  async upsertMany(records: ActivityRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('Activity')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['timestamp', 'projectId']).doUpdateSet((eb) => ({
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
      .deleteFrom('Activity')
      .where((eb) =>
        eb.and([
          eb('projectId', '=', projectId.toString()),
          eb('timestamp', '>=', fromInclusive.toDate()),
        ]),
      )
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Activity').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime, UnixTime],
  ): Promise<ActivityRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('Activity')
      .select(selectActivity)
      .where('projectId', '=', projectId.toString())
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getByProjectsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime, UnixTime],
  ): Promise<ActivityRecord[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('Activity')
      .select(selectActivity)
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<=', to.toDate())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getMaxCountForProjects() {
    const subquery = this.db
      .selectFrom('Activity')
      .select(['projectId', (eb) => eb.fn.max('count').as('max_count')])
      .groupBy('projectId')
      .as('t2')

    const rows = await this.db
      .selectFrom('Activity as t1')
      .innerJoin(subquery, (join) =>
        join
          .onRef('t1.projectId', '=', 't2.projectId')
          .onRef('t1.count', '=', 't2.max_count'),
      )
      .select(['t1.projectId', 't1.count as max_count', 't1.timestamp'])
      .execute()

    return Object.fromEntries(
      rows.map((row) => [
        row.projectId,
        {
          count: Number(row.max_count),
          timestamp: UnixTime.fromDate(row.timestamp),
        },
      ]),
    )
  }

  async getSummedCountForProjectsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime, UnixTime],
  ): Promise<Omit<ActivityRecord, 'timestamp' | 'start' | 'end'>[]> {
    const [from, to] = timeRange
    const rows = await this.db
      .selectFrom('Activity')
      .select(['projectId'])
      .select((eb) => eb.fn.sum('count').as('count'))
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('timestamp', '>=', from.toDate())
      .where('timestamp', '<', to.toDate())
      .groupBy('projectId')
      .execute()

    return rows.map((row) => ({
      projectId: ProjectId(row.projectId),
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
      .selectFrom('Activity')
      .select(selectActivity)
      .where('projectId', '=', projectId.toString())
      .where('start', '<=', dataPoint)
      .where('end', '>=', dataPoint)
      .execute()

    return rows.map(toRecord)
  }

  async getDailyCounts(): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('Activity')
      .select(selectActivity)
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getDailyCountsPerProject(
    projectId: ProjectId,
  ): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('Activity')
      .select(selectActivity)
      .where('projectId', '=', projectId.toString())
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async getProjectsAggregatedDailyCount(
    projectIds: ProjectId[],
  ): Promise<Omit<ActivityRecord, 'projectId' | 'start' | 'end'>[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('Activity')
      .where(
        'projectId',
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
