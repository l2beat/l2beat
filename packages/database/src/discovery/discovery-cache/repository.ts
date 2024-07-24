import { PostgresDatabase } from '../../kysely'
import { DiscoveryCacheRecord, toRecord, toRow } from './entity'
import { selectDiscoveryCache } from './select'

export class DiscoveryCacheRepository {
  constructor(private readonly db: PostgresDatabase) {}

  async addOrUpdate(record: DiscoveryCacheRecord): Promise<string> {
    const row = toRow(record)
    await this.db
      .insertInto('public.discovery_cache')
      .values(row)
      .onConflict((cb) =>
        cb.column('key').doUpdateSet((eb) => ({
          key: eb.ref('excluded.key'),
          value: eb.ref('excluded.value'),
          chain: eb.ref('excluded.chain'),
          block_number: eb.ref('excluded.block_number'),
        })),
      )
      .execute()

    return row.key
  }

  async findByKey(key: DiscoveryCacheRecord['key']) {
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

  async deleteAfter(blockNumber: number, chain: string): Promise<number> {
    const result = await this.db
      .deleteFrom('public.discovery_cache')
      .where('block_number', '>', blockNumber)
      .where('chain', '=', chain)
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }

  async deleteAll(): Promise<number> {
    const result = await this.db
      .deleteFrom('public.discovery_cache')
      .executeTakeFirst()
    return Number(result.numDeletedRows)
  }
}
