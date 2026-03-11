import { UnixTime } from '@l2beat/shared-pure'
import { type Insertable, type Selectable, sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropConfig } from '../kysely/generated/types'

export interface InteropConfigRecord {
  key: string
  value: unknown
  timestamp: UnixTime
}

export function toRecord(row: Selectable<InteropConfig>): InteropConfigRecord {
  return {
    key: row.key,
    value: typeof row.value === 'string' ? JSON.parse(row.value) : row.value,
    timestamp: UnixTime.fromDate(row.timestamp),
  }
}

export function toRow(record: InteropConfigRecord): Insertable<InteropConfig> {
  return {
    key: record.key,
    value: JSON.stringify(record.value),
    timestamp: UnixTime.toDate(record.timestamp),
  }
}

export class InteropConfigRepository extends BaseRepository {
  async find(key: string): Promise<InteropConfigRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropConfig')
      .selectAll()
      .where('key', '=', key)
      .orderBy('timestamp', 'desc')
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAllLatest(): Promise<InteropConfigRecord[]> {
    const rows = await this.db
      .selectFrom('InteropConfig as ic1')
      .selectAll()
      .where('ic1.timestamp', '=', (eb) =>
        eb
          .selectFrom('InteropConfig as ic2')
          .select(eb.fn.max('timestamp').as('max_timestamp'))
          .where('ic2.key', '=', eb.ref('ic1.key')),
      )
      .execute()

    return rows.map(toRecord)
  }

  async insert(record: InteropConfigRecord): Promise<void> {
    const row = toRow(record)
    await this.db.insertInto('InteropConfig').values(row).execute()
  }

  async deleteAllButLatestPerKey(keepLatest: number): Promise<number> {
    if (keepLatest < 1) {
      throw new Error('keepLatest must be >= 1')
    }

    const query = this.db
      .with('ranked', (eb) =>
        eb.selectFrom('InteropConfig').select([
          'key',
          'timestamp',
          sql<number>`row_number() over (
            partition by "key"
            order by "timestamp" desc
          )`.as('rn'),
        ]),
      )
      .deleteFrom('InteropConfig')
      .where(({ eb, exists }) =>
        exists(
          eb
            .selectFrom('ranked')
            .select('key')
            .whereRef('ranked.key', '=', 'InteropConfig.key')
            .whereRef('ranked.timestamp', '=', 'InteropConfig.timestamp')
            .where('ranked.rn', '>', keepLatest),
        ),
      )

    const result = await query.executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  // Test only methods

  async getAll(): Promise<InteropConfigRecord[]> {
    const rows = await this.db.selectFrom('InteropConfig').selectAll().execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('InteropConfig').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
