import { DiscoveryCache as DiscoveryCacheInterface } from '@l2beat/discovery'

import { Database } from '@l2beat/database'

export class DiscoveryCache implements DiscoveryCacheInterface {
  constructor(private readonly db: Database) {}

  async get(key: string): Promise<string | undefined> {
    const record = await this.db.discoveryCache.findByKey(key)
    return record?.value
  }

  async set(
    key: string,
    value: string,
    chain: string,
    blockNumber: number,
  ): Promise<void> {
    await this.db.discoveryCache.upsert({ key, value, chain, blockNumber })
  }
}
