import { UnixTime } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import { createClient, type RedisClientType } from 'redis'
import { packageHash } from '../utils/packageHash'

export interface CacheItem<T = unknown> {
  data: T
  timestamp: number
}

export class Cache {
  private client: RedisClientType | undefined
  private connectionPromise: Promise<RedisClientType> | undefined
  constructor(redisUrl: string | undefined) {
    if (!redisUrl) {
      return
    }
    this.client = createClient({
      url: redisUrl,
      socket: {
        tls: true,
        rejectUnauthorized: false,
      },
    })
  }

  generateKey(query: string, input: unknown): string {
    // hash the input to ensure that different inputs generate different keys
    const inputHash = createHash('md5')
      .update(JSON.stringify(input))
      .digest('hex')
      .slice(0, 12)

    return `${query}::${packageHash}::${inputHash}`
  }

  async write(key: string, data: unknown, expires: number) {
    if (!this.client) return
    const item: CacheItem = {
      data,
      timestamp: UnixTime.now(),
    }

    await this.connect()
    await this.client.set(key, JSON.stringify(item), {
      EX: expires,
    })
  }

  async read<T>(key: string): Promise<CacheItem<T> | undefined> {
    if (!this.client) return

    await this.connect()
    const data = await this.client.get(key)
    if (!data) {
      return undefined
    }
    const parsed = JSON.parse(data) as CacheItem<string>
    return {
      data: JSON.parse(parsed.data),
      timestamp: parsed.timestamp,
    } as CacheItem<T>
  }

  private async connect() {
    if (!this.client || this.client.isReady) return

    // Reuse the same connection promise for all concurrent requests
    this.connectionPromise ??= this.client.connect()
    await this.connectionPromise
  }
}
