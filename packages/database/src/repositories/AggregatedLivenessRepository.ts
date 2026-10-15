import {
  type ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { AggregatedLiveness } from '../kysely/generated/types'

export interface AggregatedLivenessRecord {
  timestamp: UnixTime
  projectId: string
  subtype: TrackedTxsConfigSubtype
  min: number
  avg: number
  max: number
  numberOfRecords: number
}

export function toRow(
  record: AggregatedLivenessRecord,
): Insertable<AggregatedLiveness> {
  return {
    ...record,
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export function toRecord(
  row: Selectable<AggregatedLiveness>,
): AggregatedLivenessRecord {
  return {
    ...row,
    subtype: row.subtype as TrackedTxsConfigSubtype,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export class AggregatedLivenessRepository extends BaseRepository {
  async upsertMany(records: AggregatedLivenessRecord[]): Promise<number> {
    if (records.length === 0) return 0

    const rows = records.map(toRow)
    await this.batch(rows, 1_000, async (batch) => {
      await this.db
        .insertInto('AggregatedLiveness')
        .values(batch)
        .onConflict((cb) =>
          cb
            .columns(['projectId', 'subtype', 'timestamp'])
            .doUpdateSet((eb) => ({
              min: eb.ref('excluded.min'),
              avg: eb.ref('excluded.avg'),
              max: eb.ref('excluded.max'),
              numberOfRecords: eb.ref('excluded.numberOfRecords'),
            })),
        )
        .execute()
    })
    return records.length
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('AggregatedLiveness')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async getAll(): Promise<AggregatedLivenessRecord[]> {
    const rows = await this.db
      .selectFrom('AggregatedLiveness')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  /**
   * The subset of `entries` with at least one record at or after
   * `fromInclusive`. One index probe per entry, in a single statement.
   */
  async getProjectSubtypesWithData(
    entries: readonly { projectId: string; subtype: TrackedTxsConfigSubtype }[],
    fromInclusive?: UnixTime,
  ): Promise<{ projectId: string; subtype: TrackedTxsConfigSubtype }[]> {
    if (entries.length === 0) return []

    const since =
      fromInclusive !== undefined
        ? sql`AND t."timestamp" >= ${UnixTime.toDate(fromInclusive)}`
        : sql``
    const { rows } = await sql<{ projectId: string; subtype: string }>`
      SELECT p."projectId", p.subtype
      FROM unnest(
        ${entries.map((e) => e.projectId)}::varchar[],
        ${entries.map((e) => e.subtype)}::varchar[]
      ) AS p("projectId", subtype)
      WHERE EXISTS (
        SELECT 1 FROM "AggregatedLiveness" t
        WHERE t."projectId" = p."projectId" AND t.subtype = p.subtype
        ${since}
      )
    `.execute(this.db)
    return rows.map((row) => ({
      projectId: row.projectId,
      subtype: row.subtype as TrackedTxsConfigSubtype,
    }))
  }

  async getByProjectAndSubtypeInTimeRange(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
    range: [UnixTime | null, UnixTime],
  ): Promise<AggregatedLivenessRecord[]> {
    const [from, to] = range

    let query = this.db
      .selectFrom('AggregatedLiveness')
      .selectAll()
      .where('projectId', '=', projectId)
      .where('subtype', '=', subtype)
      .where('timestamp', '<=', UnixTime.toDate(to))

    if (from) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.orderBy('timestamp', 'asc').execute()
    return rows.map(toRecord)
  }

  async getFirstTimestampByProjectAndSubtype(
    projectId: ProjectId,
    subtype: TrackedTxsConfigSubtype,
  ): Promise<UnixTime | undefined> {
    const row = await this.db
      .selectFrom('AggregatedLiveness')
      .select((eb) => eb.fn.min('timestamp').as('timestamp'))
      .where('projectId', '=', projectId)
      .where('subtype', '=', subtype)
      .executeTakeFirst()

    return row?.timestamp ? UnixTime.fromDate(row.timestamp) : undefined
  }

  async getAvgByProjectAndTimeRange(
    projectId: ProjectId,
    range: [UnixTime | null, UnixTime],
  ): Promise<
    Pick<AggregatedLivenessRecord, 'projectId' | 'subtype' | 'avg'>[]
  > {
    const [from, to] = range

    let query = this.db
      .selectFrom('AggregatedLiveness')
      .select([
        'projectId',
        'subtype',
        (eb) =>
          sql<number>`
          SUM(${eb.ref('avg')} * ${eb.ref('numberOfRecords')})
          / SUM(${eb.ref('numberOfRecords')})
        `.as('avg'),
      ])
      .where('projectId', '=', projectId)
      .where('timestamp', '<=', UnixTime.toDate(to))
      .groupBy(['projectId', 'subtype'])

    if (from) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    const rows = await query.execute()
    return rows.map((row) => ({
      ...row,
      subtype: row.subtype as TrackedTxsConfigSubtype,
      avg: Number(row.avg),
    }))
  }

  async getAggregatesByTimeRange(
    range: [UnixTime | null, UnixTime],
  ): Promise<
    Omit<AggregatedLivenessRecord, 'timestamp' | 'numberOfRecords'>[]
  > {
    const [from, to] = range

    let query = this.db
      .selectFrom('AggregatedLiveness')
      .select([
        'projectId',
        'subtype',
        (eb) => eb.fn.min('min').as('min'),
        (eb) =>
          sql<number>`
            SUM(${eb.ref('avg')} * ${eb.ref('numberOfRecords')})
            / SUM(${eb.ref('numberOfRecords')})
          `.as('avg'),
        (eb) => eb.fn.max('max').as('max'),
      ])
      .where('timestamp', '<=', UnixTime.toDate(to))

    if (from) {
      query = query.where('timestamp', '>=', UnixTime.toDate(from))
    }

    query = query.groupBy(['projectId', 'subtype'])

    const rows = await query.execute()

    return rows.map((row) => ({
      ...row,
      subtype: row.subtype as TrackedTxsConfigSubtype,
      avg: Number(row.avg),
    }))
  }
}
