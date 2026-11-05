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
   * The hours from `fullHours` before the hour of the latest block up to that
   * block, with its timestamp. Head blocks running on from the last counted
   * one join their hours, so the latest block can be the chain's head. One statement
   * reads it all, so the hour so far holds exactly the blocks until that
   * timestamp. Undefined while no block is counted, like after an
   * invalidation
   */
  async getLatestHours(
    projectId: ProjectId,
    fullHours: number,
  ): Promise<
    | { latestBlockTimestamp: UnixTime; records: HourlyActivityRecord[] }
    | undefined
  > {
    const { rows } = await sql<{
      latestBlockTimestamp: Date
      timestamp: Date | null
      count: number | null
      uopsCount: number | null
    }>`
      WITH counted AS (
        SELECT "id", "blockSyncedUntil", "latestBlockTimestamp"
        FROM "SyncMetadata"
        WHERE "feature" = 'activity'
          AND "id" = ${projectId.toString()}
          AND "latestBlockTimestamp" IS NOT NULL
      ),
      above AS (
        SELECT b."number", b."timestamp", b."count", b."uopsCount"
        FROM "ActivityHeadBlock" b
        JOIN counted ON b."projectId" = counted."id"
        WHERE b."number" > counted."blockSyncedUntil"
      ),
      -- After an invalidation the counts restart below the head blocks, which
      -- then would skip the blocks between them. Only an unbroken run counts
      head AS (
        SELECT "timestamp", "count", "uopsCount"
        FROM above
        WHERE (SELECT count(*) FROM above) =
          (SELECT max("number") FROM above) - (SELECT "blockSyncedUntil" FROM counted)
      ),
      latest AS (
        SELECT GREATEST(
          counted."latestBlockTimestamp",
          (SELECT max("timestamp") FROM head)
        ) AS "timestamp"
        FROM counted
      ),
      hours AS (
        SELECT h."timestamp", h."count", h."uopsCount"
        FROM "HourlyActivity" h
        JOIN counted ON h."projectId" = counted."id"
        WHERE h."timestamp" <= counted."latestBlockTimestamp"
        UNION ALL
        SELECT date_trunc('hour', head."timestamp"), head."count", head."uopsCount"
        FROM head
      )
      SELECT
        latest."timestamp" AS "latestBlockTimestamp",
        hours."timestamp",
        hours."count",
        hours."uopsCount"
      FROM latest
      LEFT JOIN hours ON hours."timestamp" >=
        date_trunc('hour', latest."timestamp") - make_interval(hours => ${fullHours}::int)
      ORDER BY hours."timestamp"
    `.execute(this.db)

    const latestBlockTimestamp = rows[0]?.latestBlockTimestamp
    if (!latestBlockTimestamp) return undefined

    const byHour = new Map<UnixTime, HourlyActivityRecord>()
    for (const row of rows) {
      if (row.timestamp === null || row.count === null) continue
      const timestamp = UnixTime.fromDate(row.timestamp)
      const stored = byHour.get(timestamp)
      byHour.set(timestamp, {
        projectId,
        timestamp,
        count: (stored?.count ?? 0) + row.count,
        uopsCount: stored
          ? (stored.uopsCount ?? stored.count) + (row.uopsCount ?? row.count)
          : row.uopsCount,
      })
    }
    return {
      latestBlockTimestamp: UnixTime.fromDate(latestBlockTimestamp),
      records: [...byHour.values()],
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
