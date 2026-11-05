import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { HourlyActivity } from '../kysely/generated/types'
import { addToStored } from '../utils/addToStored'

export interface HourlyActivityRecord {
  projectId: ProjectId
  timestamp: UnixTime
  count: number
  uopsCount: number | null
}

function toRecord(row: Selectable<HourlyActivity>): HourlyActivityRecord {
  return {
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
    count: row.count,
    uopsCount: row.uopsCount,
  }
}

function toRow(record: HourlyActivityRecord): Insertable<HourlyActivity> {
  return {
    projectId: record.projectId.toString(),
    timestamp: UnixTime.toDate(record.timestamp),
    count: record.count,
    uopsCount: record.uopsCount,
  }
}

export class HourlyActivityRepository extends BaseRepository {
  /**
   * Adds each record to the hour stored before, as blocks of an hour can come
   * in more than one batch
   */
  async addMany(records: HourlyActivityRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 5_000, async (batch) => {
      await this.db
        .insertInto('HourlyActivity')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['projectId', 'timestamp']).doUpdateSet({
            count: sql`"HourlyActivity"."count" + excluded."count"`,
            uopsCount: addToStored('HourlyActivity', 'uopsCount'),
          }),
        )
        .execute()
    })
    return records.length
  }

  async getByProjectsAndTimeRange(
    projectIds: ProjectId[],
    [from, to]: [UnixTime, UnixTime],
  ): Promise<HourlyActivityRecord[]> {
    if (projectIds.length === 0) return []

    const rows = await this.db
      .selectFrom('HourlyActivity')
      .selectAll()
      .where(
        'projectId',
        'in',
        projectIds.map((p) => p.toString()),
      )
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  /**
   * The hours from `fullHours` before the hour of the latest block the counts
   * include up to that block, with its timestamp. One statement reads both, so
   * the last, partial hour holds exactly the blocks until that timestamp.
   * Undefined while there is no latest block, like after an invalidation
   */
  async getLatestHours(
    projectId: ProjectId,
    fullHours: number,
  ): Promise<
    | { latestBlockTimestamp: UnixTime; records: HourlyActivityRecord[] }
    | undefined
  > {
    const rows = await this.db
      .selectFrom('SyncMetadata as s')
      .leftJoin('HourlyActivity as h', (join) =>
        join
          .onRef('h.projectId', '=', 's.id')
          .on((eb) =>
            eb.and([
              eb(
                'h.timestamp',
                '>=',
                sql<Date>`date_trunc('hour', s."latestBlockTimestamp") - make_interval(hours => ${fullHours}::int)`,
              ),
              eb('h.timestamp', '<=', eb.ref('s.latestBlockTimestamp')),
            ]),
          ),
      )
      .select([
        's.latestBlockTimestamp',
        'h.timestamp',
        'h.count',
        'h.uopsCount',
      ])
      .where('s.feature', '=', 'activity')
      .where('s.id', '=', projectId.toString())
      .where('s.latestBlockTimestamp', 'is not', null)
      .orderBy('h.timestamp', 'asc')
      .execute()

    const latestBlockTimestamp = rows[0]?.latestBlockTimestamp
    if (!latestBlockTimestamp) return undefined
    return {
      latestBlockTimestamp: UnixTime.fromDate(latestBlockTimestamp),
      records: rows.flatMap((row) =>
        row.timestamp === null || row.count === null
          ? []
          : [
              {
                projectId,
                timestamp: UnixTime.fromDate(row.timestamp),
                count: row.count,
                uopsCount: row.uopsCount,
              },
            ],
      ),
    }
  }

  /** Projects indexed per day have no hours */
  async getFirstTimestamp(projectId: ProjectId): Promise<UnixTime | undefined> {
    const result = await this.db
      .selectFrom('HourlyActivity')
      .select((eb) => eb.fn.min('timestamp').as('min_timestamp'))
      .where('projectId', '=', projectId.toString())
      .executeTakeFirst()
    return result?.min_timestamp
      ? UnixTime.fromDate(result.min_timestamp)
      : undefined
  }

  async deleteByProjectIdFrom(
    projectId: ProjectId,
    fromInclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('HourlyActivity')
      .where('projectId', '=', projectId.toString())
      .where('timestamp', '>=', UnixTime.toDate(fromInclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByProjectIdUntil(
    projectId: ProjectId,
    toExclusive: UnixTime,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('HourlyActivity')
      .where('projectId', '=', projectId.toString())
      .where('timestamp', '<', UnixTime.toDate(toExclusive))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('HourlyActivity').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
