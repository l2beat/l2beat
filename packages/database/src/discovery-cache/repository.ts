import { PostgresDatabase } from '../kysely'
import { DiscoveryCache, toRecord, toRow } from './entity'
import { selectDiscoveryCache } from './select'

export class DiscoveryCacheRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(record: DiscoveryCache): Promise<string> {
    const row = toRow(record)
    await this.db
      .insertInto('public.discovery_cache')
      .values(row)
      .onConflict((cb) => cb.doUpdateSet(row))
      .execute()

    return row.key
  }

  async findByKey(key: DiscoveryCache['key']) {
    const row = await this.db
      .selectFrom('public.discovery_cache')
      .select(selectDiscoveryCache)
      .where('key', '=', key)
      .executeTakeFirst()

    return row ? toRecord(row) : undefined
  }

  async getAll() {
    const rows = await this.db
      .selectFrom('public.discovery_cache')
      .select(selectDiscoveryCache)
      .execute()

    return rows.map(toRecord)
  }

  async deleteAfter(blockNumber: number, chain: string) {
    return this.db
      .deleteFrom('public.discovery_cache')
      .where((eb) =>
        eb.and([eb('block_number', '>', blockNumber), eb('chain', '=', chain)]),
      )
      .execute()
  }

  deleteAll() {
    return this.db.deleteFrom('public.discovery_cache').execute()
  }
}
