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
  /** Of the busiest UTC minute in the hour */
  peakCount: number | null
  peakUopsCount: number | null
}

function toRecord(row: Selectable<HourlyActivity>): HourlyActivityRecord {
  return {
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
    count: row.count,
    uopsCount: row.uopsCount,
    peakCount: row.peakCount,
    peakUopsCount: row.peakUopsCount,
  }
}

function toRow(record: HourlyActivityRecord): Insertable<HourlyActivity> {
  return {
    projectId: record.projectId.toString(),
    timestamp: UnixTime.toDate(record.timestamp),
    count: record.count,
    uopsCount: record.uopsCount,
    peakCount: record.peakCount,
    peakUopsCount: record.peakUopsCount,
  }
}

export class HourlyActivityRepository extends BaseRepository {
  /**
   * Adds each record to the hour stored before, as blocks of an hour can come
   * in more than one batch. The larger peak stays
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
            peakCount: sql`greatest("HourlyActivity"."peakCount", excluded."peakCount")`,
            peakUopsCount: sql`greatest("HourlyActivity"."peakUopsCount", excluded."peakUopsCount")`,
          }),
        )
        .execute()
    })
    return records.length
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

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('HourlyActivity').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
