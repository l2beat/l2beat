import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { Activity } from '../kysely/generated/types'

export interface ActivityRecord {
  projectId: ProjectId
  timestamp: UnixTime
  count: number
  uopsCount: number | null
  start: number
  end: number
}

export interface ActivityTotals {
  count: number
  uopsCount: number
  sinceTimestamp: UnixTime
  uopsSinceTimestamp: UnixTime | undefined
}

export function toRecord(row: Selectable<Activity>): ActivityRecord {
  return {
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
    count: row.count,
    uopsCount: row.uopsCount,
    start: row.start,
    end: row.end,
  }
}

export function toRow(record: ActivityRecord): Insertable<Activity> {
  return {
    projectId: record.projectId.toString(),
    timestamp: UnixTime.toDate(record.timestamp),
    count: record.count,
    uopsCount: record.uopsCount,
    start: record.start,
    end: record.end,
  }
}

export class ActivityRepository extends BaseRepository {
  async getAll(): Promise<ActivityRecord[]> {
    const rows = await this.db.selectFrom('Activity').selectAll().execute()
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
            uopsCount: eb.ref('excluded.uopsCount'),
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
          eb('timestamp', '>=', UnixTime.toDate(fromInclusive)),
        ]),
      )
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('Activity').executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getMaxTimestampAtOrBeforeForProjects(
    timestamp: UnixTime,
    projectIds: readonly string[],
  ): Promise<UnixTime | undefined> {
    if (projectIds.length === 0) {
      return undefined
    }

    const result = await this.db
      .selectFrom('Activity')
      .select((eb) => eb.fn.max('timestamp').as('max_timestamp'))
      .where('timestamp', '<=', UnixTime.toDate(timestamp))
      .where('projectId', 'in', projectIds)
      .executeTakeFirst()
    return result?.max_timestamp
      ? UnixTime.fromDate(result.max_timestamp)
      : undefined
  }

  async getByTimestamp(timestamp: UnixTime): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('Activity')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .execute()

    return rows.map(toRecord)
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime | null, UnixTime],
  ): Promise<ActivityRecord[]> {
    const [from, to] = timeRange
    let query = this.db
      .selectFrom('Activity')
      .selectAll()
      .where('projectId', '=', projectId.toString())

      .where('timestamp', '<=', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()
    return rows.map(toRecord)
  }

  async getByProjectsAndTimeRange(
    projectIds: ProjectId[],
    timeRange: [UnixTime | null, UnixTime],
  ): Promise<ActivityRecord[]> {
    if (projectIds.length === 0) return []

    const [from, to] = timeRange
    let query = this.db
      .selectFrom('Activity')
      .selectAll()
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('timestamp', '<=', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    query = query
      .where('timestamp', '<=', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')

    const rows = await query.execute()

    return rows.map(toRecord)
  }

  async getSummedByTimestamp(
    projectIds: ProjectId[],
    timeRange: [UnixTime | null, UnixTime],
  ): Promise<{ timestamp: UnixTime; count: number; uopsCount: number }[]> {
    if (projectIds.length === 0) return []

    const [from, to] = timeRange
    let query = this.db
      .selectFrom('Activity')
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('timestamp', '<=', UnixTime.toDate(to))
      .select('timestamp')
      .select((eb) => eb.fn.sum('count').as('count'))
      .select((eb) =>
        eb.fn
          .sum(eb.fn.coalesce('Activity.uopsCount', 'Activity.count'))
          .as('uopsCount'),
      )
      .groupBy('timestamp')
      .orderBy('timestamp', 'asc')

    if (from !== null) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()

    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.timestamp),
      count: Number(row.count),
      uopsCount: Number(row.uopsCount),
    }))
  }

  async getMaxCountsForProjects() {
    const uopsSubquery = this.db
      .selectFrom('Activity')
      .select([
        'projectId',
        (eb) =>
          eb.fn
            .max(eb.fn.coalesce('Activity.uopsCount', 'Activity.count'))
            .as('max_uops_count'),
      ])
      .groupBy('projectId')
      .as('t2')

    const query = this.db
      .selectFrom('Activity as t1')
      .innerJoin(uopsSubquery, (join) =>
        join
          .onRef('t1.projectId', '=', 't2.projectId')
          .onRef(
            (eb) => eb.fn.coalesce('t1.uopsCount', 't1.count'),
            '=',
            't2.max_uops_count',
          ),
      )
      .innerJoin('Activity as count_table', (join) =>
        join
          .onRef('t1.projectId', '=', 'count_table.projectId')
          .onRef('count_table.count', '=', (eb) =>
            eb
              .selectFrom('Activity as max_count')
              .select(eb.fn.max('count').as('max_count'))
              .whereRef('max_count.projectId', '=', 't1.projectId'),
          ),
      )
      .select([
        't1.projectId',
        (eb) => eb.fn.coalesce('t1.uopsCount', 't1.count').as('max_uops_count'),
        't1.timestamp as uops_timestamp',
        'count_table.count as max_count',
        'count_table.timestamp as count_timestamp',
      ])

    const rows = await query.execute()

    return Object.fromEntries(
      rows.map((row) => [
        row.projectId,
        {
          uopsCount: Number(row.max_uops_count),
          uopsTimestamp: UnixTime.fromDate(row.uops_timestamp),
          count: Number(row.max_count),
          countTimestamp: UnixTime.fromDate(row.count_timestamp),
        },
      ]),
    )
  }

  async getMaxCountsForProject(projectId: ProjectId): Promise<
    | {
        uopsCount: number
        uopsTimestamp: UnixTime
        count: number
        countTimestamp: UnixTime
      }
    | undefined
  > {
    const uopsRow = await this.db
      .selectFrom('Activity')
      .select([
        (eb) =>
          eb.fn
            .coalesce('Activity.uopsCount', 'Activity.count')
            .as('uopsCount'),
        'timestamp',
      ])
      .where('projectId', '=', projectId.toString())
      .orderBy(
        (eb) => eb.fn.coalesce('Activity.uopsCount', 'Activity.count'),
        'desc',
      )
      .limit(1)
      .executeTakeFirst()

    const countRow = await this.db
      .selectFrom('Activity')
      .select(['count', 'timestamp'])
      .where('projectId', '=', projectId.toString())
      .orderBy('count', 'desc')
      .limit(1)
      .executeTakeFirst()

    if (!uopsRow || !countRow) return undefined

    return {
      uopsCount: Number(uopsRow.uopsCount),
      uopsTimestamp: UnixTime.fromDate(uopsRow.timestamp),
      count: Number(countRow.count),
      countTimestamp: UnixTime.fromDate(countRow.timestamp),
    }
  }

  async getActivityTotalsForProjects(
    projectIds: ProjectId[],
  ): Promise<Partial<Record<ProjectId, ActivityTotals>>> {
    if (projectIds.length === 0) return {}

    const rows = await this.db
      .selectFrom('Activity')
      .select([
        'projectId',
        (eb) => eb.fn.sum('count').as('total_count'),
        (eb) =>
          eb.fn
            .sum(eb.fn.coalesce('Activity.uopsCount', 'Activity.count'))
            .as('total_uops_count'),
        (eb) => eb.fn.min('timestamp').as('since_timestamp'),
        (eb) =>
          eb.fn
            .min('timestamp')
            .filterWhere('uopsCount', 'is not', null)
            .as('uops_since_timestamp'),
      ])
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .groupBy('projectId')
      .execute()

    return Object.fromEntries(
      rows.map((row) => [
        ProjectId(row.projectId),
        {
          count: Number(row.total_count),
          uopsCount: Number(row.total_uops_count),
          sinceTimestamp: UnixTime.fromDate(row.since_timestamp),
          uopsSinceTimestamp: row.uops_since_timestamp
            ? UnixTime.fromDate(row.uops_since_timestamp)
            : undefined,
        },
      ]),
    )
  }

  async getSummedUopsCountForProjectAndTimeRange(
    projectId: ProjectId,
    timeRange: [UnixTime | null, UnixTime],
  ): Promise<number | undefined> {
    const [from, to] = timeRange
    let query = this.db
      .selectFrom('Activity')
      .select((eb) =>
        eb.fn
          .sum(eb.fn.coalesce('Activity.uopsCount', 'Activity.count'))
          .as('count'),
      )
      .where('projectId', '=', projectId.toString())
      .where('timestamp', '<=', UnixTime.toDate(to))

    if (from) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }
    const row = await query.executeTakeFirst()
    return row ? Number(row.count) : undefined
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
      .selectAll()
      .where('projectId', '=', projectId.toString())
      .where('start', '<=', dataPoint)
      .where('end', '>=', dataPoint)
      .execute()

    return rows.map(toRecord)
  }

  async getDailyCounts(): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('Activity')
      .selectAll()
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async getDailyCountsPerProject(
    projectId: ProjectId,
  ): Promise<ActivityRecord[]> {
    const rows = await this.db
      .selectFrom('Activity')
      .selectAll()
      .where('projectId', '=', projectId.toString())
      .orderBy('timestamp', 'asc')
      .execute()

    return rows.map(toRecord)
  }

  async getProjectsAggregatedDailyCount(
    projectIds: ProjectId[],
  ): Promise<
    Omit<ActivityRecord, 'projectId' | 'start' | 'end' | 'uopsCount'>[]
  > {
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

  async getLatestProcessedBlock(projectId: ProjectId) {
    const latestRecord = await this.db
      .selectFrom('Activity')
      .selectAll()
      .where('projectId', '=', projectId)
      .orderBy('timestamp', 'desc')
      .executeTakeFirst()

    return latestRecord?.end
  }
}
