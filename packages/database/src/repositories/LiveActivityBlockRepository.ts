import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { LiveActivityBlock } from '../kysely/generated/types'

export interface LiveActivityBlockRecord {
  projectId: ProjectId
  number: number
  hash: string
  parentHash: string
  timestamp: UnixTime
  count: number
  uopsCount: number | null
  gasUsed: number
}

/** A project's blocks of one bucket of seconds, summed */
export interface LiveActivityBucketRecord {
  /** Of the bucket's first second */
  timestamp: UnixTime
  blocks: number
  count: number
  /** The transaction count of blocks with no user operations counted */
  uopsCount: number
  gasUsed: number
}

/** The blocks of one hour of a project's chain, summed */
export interface LiveActivityHourRecord {
  timestamp: UnixTime
  blocks: number
  count: number
  /** The transaction count of blocks with no user operations counted */
  uopsCount: number
  firstNumber: number
  lastNumber: number
  lastTimestamp: UnixTime
}

function toRecord(row: Selectable<LiveActivityBlock>): LiveActivityBlockRecord {
  return {
    ...row,
    projectId: ProjectId(row.projectId),
    timestamp: UnixTime.fromDate(row.timestamp),
    gasUsed: Number(row.gasUsed),
  }
}

function toRow(record: LiveActivityBlockRecord): Insertable<LiveActivityBlock> {
  return {
    ...record,
    projectId: record.projectId.toString(),
    timestamp: UnixTime.toDate(record.timestamp),
    gasUsed: record.gasUsed.toString(),
  }
}

export class LiveActivityBlockRepository extends BaseRepository {
  async upsertMany(records: LiveActivityBlockRecord[]): Promise<number> {
    if (records.length === 0) return 0

    await this.batch(records.map(toRow), 5_000, async (batch) => {
      await this.db
        .insertInto('LiveActivityBlock')
        .values(batch)
        .onConflict((cb) =>
          cb.columns(['projectId', 'number']).doUpdateSet((eb) => ({
            hash: eb.ref('excluded.hash'),
            parentHash: eb.ref('excluded.parentHash'),
            timestamp: eb.ref('excluded.timestamp'),
            count: eb.ref('excluded.count'),
            uopsCount: eb.ref('excluded.uopsCount'),
            gasUsed: eb.ref('excluded.gasUsed'),
          })),
        )
        .execute()
    })
    return records.length
  }

  /** The project's newest blocks, oldest first */
  async getNewest(
    projectId: ProjectId,
    limit: number,
  ): Promise<LiveActivityBlockRecord[]> {
    const rows = await this.db
      .selectFrom('LiveActivityBlock')
      .selectAll()
      .where('projectId', '=', projectId.toString())
      .orderBy('number', 'desc')
      .limit(limit)
      .execute()
    return rows.map(toRecord).reverse()
  }

  /** Of the project's oldest stored block */
  async getOldestTimestamp(
    projectId: ProjectId,
  ): Promise<UnixTime | undefined> {
    const row = await this.db
      .selectFrom('LiveActivityBlock')
      .select('timestamp')
      .where('projectId', '=', projectId.toString())
      .orderBy('number', 'asc')
      .limit(1)
      .executeTakeFirst()
    return row && UnixTime.fromDate(row.timestamp)
  }

  /** Both ends included, oldest first */
  async getByProjectNumberRange(
    projectId: ProjectId,
    from: number,
    to: number,
  ): Promise<LiveActivityBlockRecord[]> {
    const rows = await this.db
      .selectFrom('LiveActivityBlock')
      .selectAll()
      .where('projectId', '=', projectId.toString())
      .where('number', '>=', from)
      .where('number', '<=', to)
      .orderBy('number')
      .execute()
    return rows.map(toRecord)
  }

  /**
   * The project's blocks from `from` to `to`, both included, summed in
   * buckets of `seconds` counted from the epoch, oldest first. Buckets with
   * no block are left out
   */
  async getProjectBuckets(
    projectId: ProjectId,
    from: UnixTime,
    to: UnixTime,
    seconds: number,
  ): Promise<LiveActivityBucketRecord[]> {
    const { rows } = await sql<{
      timestamp: string
      blocks: string
      count: string
      uopsCount: string
      gasUsed: string
    }>`
      SELECT
        floor(extract(epoch FROM "timestamp") / ${seconds}) * ${seconds} AS "timestamp",
        count(*) AS "blocks",
        sum("count") AS "count",
        sum(coalesce("uopsCount", "count")) AS "uopsCount",
        sum("gasUsed") AS "gasUsed"
      FROM "LiveActivityBlock"
      WHERE "projectId" = ${projectId.toString()}
        AND "timestamp" >= ${UnixTime.toDate(from)}
        AND "timestamp" <= ${UnixTime.toDate(to)}
      GROUP BY 1
      ORDER BY 1
    `.execute(this.db)
    return rows.map((row) => ({
      timestamp: UnixTime(Number(row.timestamp)),
      blocks: Number(row.blocks),
      count: Number(row.count),
      uopsCount: Number(row.uopsCount),
      gasUsed: Number(row.gasUsed),
    }))
  }

  /** The project's blocks above the number, oldest hour first */
  async getHoursAfter(
    projectId: ProjectId,
    number: number,
  ): Promise<LiveActivityHourRecord[]> {
    const { rows } = await sql<{
      timestamp: Date
      blocks: string
      count: string
      uopsCount: string
      firstNumber: number
      lastNumber: number
      lastTimestamp: Date
    }>`
      SELECT
        date_trunc('hour', "timestamp") AS "timestamp",
        count(*) AS "blocks",
        sum("count") AS "count",
        sum(coalesce("uopsCount", "count")) AS "uopsCount",
        min("number") AS "firstNumber",
        max("number") AS "lastNumber",
        max("timestamp") AS "lastTimestamp"
      FROM "LiveActivityBlock"
      WHERE "projectId" = ${projectId.toString()} AND "number" > ${number}
      GROUP BY 1
      ORDER BY 1
    `.execute(this.db)
    return rows.map((row) => ({
      timestamp: UnixTime.fromDate(row.timestamp),
      blocks: Number(row.blocks),
      count: Number(row.count),
      uopsCount: Number(row.uopsCount),
      firstNumber: row.firstNumber,
      lastNumber: row.lastNumber,
      lastTimestamp: UnixTime.fromDate(row.lastTimestamp),
    }))
  }

  async deleteByProjectAfter(
    projectId: ProjectId,
    number: number,
  ): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveActivityBlock')
      .where('projectId', '=', projectId.toString())
      .where('number', '>', number)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteByProject(projectId: ProjectId): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveActivityBlock')
      .where('projectId', '=', projectId.toString())
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteBefore(timestamp: UnixTime): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveActivityBlock')
      .where('timestamp', '<', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('LiveActivityBlock')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
