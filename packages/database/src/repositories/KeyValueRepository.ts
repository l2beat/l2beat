import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable } from 'kysely'
import { sql } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { KeyValue } from '../kysely/generated/types'

export interface KeyValueRecord {
  key: string
  value: string
  updatedAt: UnixTime
  updatedBy: string
}

export function toRecord(row: Selectable<KeyValue>): KeyValueRecord {
  return {
    key: row.key,
    value: row.value,
    updatedAt: UnixTime.fromDate(row.updatedAt),
    updatedBy: row.updatedBy,
  }
}

export function toRow(
  record: Omit<KeyValueRecord, 'id'>,
): Insertable<KeyValue> {
  return {
    key: record.key,
    value: record.value,
    updatedAt: UnixTime.toDate(record.updatedAt),
    updatedBy: record.updatedBy,
  }
}

export class KeyValueRepository extends BaseRepository {
  async set(record: Omit<KeyValueRecord, 'updatedAt'>): Promise<void> {
    await this.db
      .insertInto('KeyValue')
      .values({
        ...record,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .onConflict((oc) =>
        oc.column('key').doUpdateSet({
          value: record.value,
          updatedAt: sql`CURRENT_TIMESTAMP`,
          updatedBy: record.updatedBy,
        }),
      )
      .execute()
  }

  async get(key: string): Promise<KeyValueRecord | undefined> {
    const row = await this.db
      .selectFrom('KeyValue')
      .selectAll()
      .where('key', '=', key)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('KeyValue').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
