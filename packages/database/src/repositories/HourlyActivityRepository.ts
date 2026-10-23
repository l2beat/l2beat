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
   * in more than one batch, and returns the hours as stored after
   */
  async addMany(
    records: HourlyActivityRecord[],
  ): Promise<HourlyActivityRecord[]> {
    const stored: HourlyActivityRecord[] = []
    await this.batch(records.map(toRow), 5_000, async (batch) => {
      const rows = await this.db
        .insertInto('HourlyActivity')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['projectId', 'timestamp']).doUpdateSet({
            count: sql`"HourlyActivity"."count" + excluded."count"`,
            uopsCount: addToStored('HourlyActivity', 'uopsCount'),
          }),
        )
        .returningAll()
        .execute()
      stored.push(...rows.map(toRecord))
    })
    return stored
  }

  async getByProjectAndTimeRange(
    projectId: ProjectId,
    [from, to]: [UnixTime, UnixTime],
  ): Promise<HourlyActivityRecord[]> {
    const rows = await this.db
      .selectFrom('HourlyActivity')
      .selectAll()
      .where('projectId', '=', projectId.toString())
      .where('timestamp', '>=', UnixTime.toDate(from))
      .where('timestamp', '<=', UnixTime.toDate(to))
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
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
