import { PrismaClient } from '../../db/prisma.js'
import { Cache } from './types.js'

export class DatabaseCache implements Cache {
  constructor(private readonly db: PrismaClient) {}

  async set(
    key: string,
    value: string,
    chainId: number,
    blockNumber?: number,
  ): Promise<void> {
    await this.db.cache.upsert({
      where: { key },
      update: { value, chainId, blockNumber },
      create: { key, value, chainId, blockNumber },
    })
  }

  async get(key: string): Promise<string | undefined> {
    const entry = await this.db.cache.findUnique({ where: { key } })

    if (entry) {
      return entry.value
    }
  }
}
