import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropAggregationQuality } from '../kysely/generated/types'

export interface InteropAggregationQualityRecord {
  timestamp: UnixTime
  autoPromoted: boolean
  isPromoted: boolean
  promotionRequired: boolean
  reasons: string[]
  checkedGroups: number
  failingGroups: number
  createdAt: UnixTime
}

export type NewInteropAggregationQualityRecord = Omit<
  InteropAggregationQualityRecord,
  'createdAt'
>

export function toRecord(
  row: Selectable<InteropAggregationQuality>,
): InteropAggregationQualityRecord {
  return {
    timestamp: UnixTime.fromDate(row.timestamp),
    autoPromoted: row.autoPromoted,
    isPromoted: row.isPromoted,
    promotionRequired: row.promotionRequired,
    reasons: parseReasons(row.reasons),
    checkedGroups: row.checkedGroups,
    failingGroups: row.failingGroups,
    createdAt: UnixTime.fromDate(row.createdAt),
  }
}

function toRow(
  record: NewInteropAggregationQualityRecord,
): Insertable<Omit<InteropAggregationQuality, 'createdAt'>> {
  return {
    timestamp: UnixTime.toDate(record.timestamp),
    autoPromoted: record.autoPromoted,
    isPromoted: record.isPromoted,
    promotionRequired: record.promotionRequired,
    reasons: JSON.stringify(record.reasons),
    checkedGroups: record.checkedGroups,
    failingGroups: record.failingGroups,
  }
}

function parseReasons(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value)
    if (Array.isArray(parsed) && parsed.every((v) => typeof v === 'string')) {
      return parsed
    }
  } catch {
    // no-op
  }
  return []
}

export class InteropAggregationQualityRepository extends BaseRepository {
  async upsert(record: NewInteropAggregationQualityRecord): Promise<void> {
    const row = toRow(record)
    await this.db
      .insertInto('InteropAggregationQuality')
      .values(row)
      .onConflict((cb) =>
        cb.columns(['timestamp']).doUpdateSet((eb) => ({
          autoPromoted: eb.ref('excluded.autoPromoted'),
          isPromoted: eb.ref('excluded.isPromoted'),
          promotionRequired: eb.ref('excluded.promotionRequired'),
          reasons: eb.ref('excluded.reasons'),
          checkedGroups: eb.ref('excluded.checkedGroups'),
          failingGroups: eb.ref('excluded.failingGroups'),
        })),
      )
      .execute()
  }

  async findLatest(): Promise<InteropAggregationQualityRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropAggregationQuality')
      .selectAll()
      .orderBy('timestamp', 'desc')
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async findLatestPromoted(): Promise<
    InteropAggregationQualityRecord | undefined
  > {
    const row = await this.db
      .selectFrom('InteropAggregationQuality')
      .selectAll()
      .where('isPromoted', '=', true)
      .orderBy('timestamp', 'desc')
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async findLatestPromotedTimestampsPerDay(): Promise<UnixTime[]> {
    const rows = await this.db
      .selectFrom('InteropAggregationQuality')
      .select((eb) => [
        sql<Date>`date_trunc('day', timestamp)`.as('day'),
        eb.fn.max('timestamp').as('latest_timestamp'),
      ])
      .where('isPromoted', '=', true)
      .groupBy(sql`date_trunc('day', timestamp)`)
      .orderBy('day', 'desc')
      .execute()

    return rows.map((row) => UnixTime.fromDate(row.latest_timestamp))
  }

  async findByTimestamp(
    timestamp: UnixTime,
  ): Promise<InteropAggregationQualityRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropAggregationQuality')
      .selectAll()
      .where('timestamp', '=', UnixTime.toDate(timestamp))
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAll(): Promise<InteropAggregationQualityRecord[]> {
    const rows = await this.db
      .selectFrom('InteropAggregationQuality')
      .selectAll()
      .orderBy('timestamp', 'asc')
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('InteropAggregationQuality')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
