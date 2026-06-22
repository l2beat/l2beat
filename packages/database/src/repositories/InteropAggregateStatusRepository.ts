import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropAggregateStatus } from '../kysely/generated/types'

export type InteropAggregateStatusValue = 'promoted' | 'blocked'

export interface InteropAggregateStatusRecord {
  /** Identifies the aggregate snapshot (the aggregation `to` timestamp). */
  timestamp: UnixTime
  status: InteropAggregateStatusValue
  /** 'auto' for engine verdicts, operator email for manual flips. */
  promotedBy: string | undefined
  /** Decision payload (RuleViolation[]) when blocked; opaque to the DB layer. */
  reasons: unknown | undefined
  checkedAt: UnixTime
  updatedAt: UnixTime
}

export function toRecord(
  row: Selectable<InteropAggregateStatus>,
): InteropAggregateStatusRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    status: row.status as InteropAggregateStatusValue,
    promotedBy: row.promotedBy ?? undefined,
    reasons: row.reasons != null ? JSON.parse(row.reasons) : undefined,
    checkedAt: UnixTime.fromDate(row.checkedAt),
    updatedAt: UnixTime.fromDate(row.updatedAt),
  }
}

export function toRow(
  record: InteropAggregateStatusRecord,
): Insertable<InteropAggregateStatus> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    status: record.status,
    promotedBy: record.promotedBy ?? null,
    // stored as JSON text (the column is `String`); parsed back in `toRecord`
    reasons:
      record.reasons === undefined ? null : JSON.stringify(record.reasons),
    checkedAt: UnixTime.toDate(record.checkedAt),
    updatedAt: UnixTime.toDate(record.updatedAt),
  }
}

export class InteropAggregateStatusRepository extends BaseRepository {
  /**
   * Engine write. Sticky: inserts a new row, or updates an existing one ONLY when
   * its `promotedBy` is still `'auto'`. A human verdict (non-`auto`) is never
   * downgraded by the engine.
   */
  async upsertAuto(record: {
    timestamp: UnixTime
    status: InteropAggregateStatusValue
    reasons?: unknown
  }): Promise<void> {
    const now = UnixTime.now()
    const row = toRow({
      timestamp: record.timestamp,
      status: record.status,
      promotedBy: 'auto',
      reasons: record.reasons,
      checkedAt: now,
      updatedAt: now,
    })
    await this.db
      .insertInto('InteropAggregateStatus')
      .values(row)
      .onConflict((oc) =>
        oc
          .column('timestamp')
          .doUpdateSet({
            status: row.status,
            promotedBy: row.promotedBy,
            reasons: row.reasons,
            checkedAt: row.checkedAt,
            updatedAt: row.updatedAt,
          })
          // existing row only (table-qualified to disambiguate from `excluded`) —
          // never overwrite a manual (non-`auto`) verdict
          .where('InteropAggregateStatus.promotedBy', '=', 'auto'),
      )
      .execute()
  }

  /** Manual (operator) write — unconditional; takes precedence over the engine. */
  async upsert(record: {
    timestamp: UnixTime
    status: InteropAggregateStatusValue
    promotedBy: string
    reasons?: unknown
  }): Promise<void> {
    const now = UnixTime.now()
    const row = toRow({
      timestamp: record.timestamp,
      status: record.status,
      promotedBy: record.promotedBy,
      reasons: record.reasons,
      checkedAt: now,
      updatedAt: now,
    })
    await this.db
      .insertInto('InteropAggregateStatus')
      .values(row)
      .onConflict((oc) =>
        oc.column('timestamp').doUpdateSet({
          status: row.status,
          promotedBy: row.promotedBy,
          reasons: row.reasons,
          checkedAt: row.checkedAt,
          updatedAt: row.updatedAt,
        }),
      )
      .execute()
  }

  async getLatestPromotedTimestamp(): Promise<UnixTime | undefined> {
    const result = await this.db
      .selectFrom('InteropAggregateStatus')
      .select((eb) => eb.fn.max('timestamp').as('max_timestamp'))
      .where('status', '=', 'promoted')
      .executeTakeFirst()
    return result?.max_timestamp
      ? UnixTime.fromDate(result.max_timestamp)
      : undefined
  }

  async getEarliestPromotedTimestampForDay(
    timestamp: UnixTime,
  ): Promise<UnixTime | undefined> {
    const result = await this.db
      .selectFrom('InteropAggregateStatus')
      .select((eb) => eb.fn.min('timestamp').as('min_timestamp'))
      .where('status', '=', 'promoted')
      .where(
        sql`date_trunc('day', timestamp)`,
        '=',
        sql`date_trunc('day', ${UnixTime.toDate(timestamp)}::timestamp)`,
      )
      .executeTakeFirst()
    return result?.min_timestamp
      ? UnixTime.fromDate(result.min_timestamp)
      : undefined
  }

  async getByTimestamp(
    timestamp: UnixTime,
  ): Promise<InteropAggregateStatusRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropAggregateStatus')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()
    return row ? toRecord(row) : undefined
  }

  async getRecent(limit: number): Promise<InteropAggregateStatusRecord[]> {
    const rows = await this.db
      .selectFrom('InteropAggregateStatus')
      .selectAll()
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .execute()
    return rows.map(toRecord)
  }

  /** Drops status rows whose snapshot no longer exists (kept in lockstep with retention). */
  async deleteOrphaned(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropAggregateStatus')
      .where('timestamp', 'not in', (eb) =>
        eb.selectFrom('AggregatedInteropTransfer').select('timestamp'),
      )
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropAggregateStatus')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
