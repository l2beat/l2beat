import { Database } from '@l2beat/database'
import { Cache } from './types.js'

export class DatabaseCache implements Cache {
  constructor(private readonly db: Database) {}

  async set(
    key: string,
    value: string,
    chainId: number,
    blockNumber?: number,
  ): Promise<void> {
    await this.db.cache.upsert({
      key,
      value,
      chainId,
      blockNumber: blockNumber ?? null,
    })
  }

  async get(key: string): Promise<string | undefined> {
    const entry = await this.db.cache.findByKey(key)

    if (entry) {
      return entry.value
    }
  }
}
