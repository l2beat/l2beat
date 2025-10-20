import { UnixTime } from '@l2beat/shared-pure'
import type { Insertable, Selectable, Updateable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { InteropConfig } from '../kysely/generated/types'

export interface InteropConfigRecord {
  key: string
  value: unknown
  createdAt: UnixTime
  updatedAt: UnixTime
}

export function toRecord(row: Selectable<InteropConfig>): InteropConfigRecord {
  return {
    key: row.key,
    value: typeof row.value === 'string' ? JSON.parse(row.value) : row.value,
    createdAt: UnixTime.fromDate(row.createdAt),
    updatedAt: UnixTime.fromDate(row.updatedAt),
  }
}

export function toRow(record: InteropConfigRecord): Insertable<InteropConfig> {
  return {
    key: record.key,
    value: JSON.stringify(record.value),
    createdAt: UnixTime.toDate(record.createdAt),
    updatedAt: UnixTime.toDate(record.updatedAt),
  }
}

export function toUpdateRow(
  record: Partial<InteropConfigRecord>,
): Updateable<InteropConfig> {
  return {
    ...(record.value !== undefined && { value: JSON.stringify(record.value) }),
    ...(record.updatedAt !== undefined && {
      updatedAt: UnixTime.toDate(record.updatedAt),
    }),
  }
}

export class InteropConfigRepository extends BaseRepository {
  async find(key: string): Promise<InteropConfigRecord | undefined> {
    const row = await this.db
      .selectFrom('InteropConfig')
      .selectAll()
      .where('key', '=', key)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async insert(record: InteropConfigRecord): Promise<void> {
    const row = toRow(record)
    await this.db.insertInto('InteropConfig').values(row).execute()
  }

  async update(
    key: string,
    update: Partial<Omit<InteropConfigRecord, 'key' | 'createdAt'>>,
  ): Promise<void> {
    const updateRow = toUpdateRow(update)
    await this.db
      .updateTable('InteropConfig')
      .set(updateRow)
      .where('key', '=', key)
      .execute()
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
