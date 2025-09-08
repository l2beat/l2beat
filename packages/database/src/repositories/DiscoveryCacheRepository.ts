import type { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../BaseRepository'
import type { DiscoveryCache } from '../kysely/generated/types'

export interface DiscoveryCacheRecord {
  key: string
  value: string
}

export function toRecord(
  row: Selectable<DiscoveryCache>,
): DiscoveryCacheRecord {
  return row
}

export function toRow(
  record: DiscoveryCacheRecord,
): Insertable<DiscoveryCache> {
  return record
}

export class DiscoveryCacheRepository extends BaseRepository {
  async upsert(record: DiscoveryCacheRecord): Promise<string> {
    const row = toRow(record)
    await this.db
      .insertInto('DiscoveryCache')
      .values(row)
      .onConflict((cb) =>
        cb.column('key').doUpdateSet((eb) => ({
          key: eb.ref('excluded.key'),
          value: eb.ref('excluded.value'),
        })),
      )
      .execute()
    return row.key
  }

  async findByKey(key: string): Promise<DiscoveryCacheRecord | undefined> {
    const row = await this.db
      .selectFrom('DiscoveryCache')
      .selectAll()
      .where('key', '=', key)
      .limit(1)
      .executeTakeFirst()
    return row && toRecord(row)
  }

  async getAll(): Promise<DiscoveryCacheRecord[]> {
    const rows = await this.db
      .selectFrom('DiscoveryCache')
      .selectAll()
      .execute()
    return rows.map(toRecord)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db.deleteFrom('DiscoveryCache').executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
