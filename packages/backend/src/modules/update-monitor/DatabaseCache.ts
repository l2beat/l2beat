import type { Database } from '@l2beat/database'
import type { DiscoveryCache as DiscoveryCacheInterface } from '@l2beat/discovery'

export class DatabaseCache implements DiscoveryCacheInterface {
  constructor(private readonly db: Database) {}

  async get(key: string): Promise<string | undefined> {
    const record = await this.db.discoveryCache.findByKey(key)
    return record?.value
  }

  async set(key: string, value: string): Promise<void> {
    await this.db.discoveryCache.upsert({ key, value })
  }
}
