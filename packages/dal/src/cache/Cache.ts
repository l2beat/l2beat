import { createHash } from 'crypto'
import { createClient, type RedisClientType } from 'redis'

const DEFAULT_EXPIRATION = 10 * 60 // 10 minutes

export class Cache {
  private client: RedisClientType
  constructor(redisUrl: string) {
    this.client = createClient({
      url: redisUrl,
      socket: {
        tls: true,
        rejectUnauthorized: false,
      },
    })
  }

  generateKey(query: string, input: string[]) {
    const inputHash = createHash('sha1')
      .update(input.join(''))
      .digest('hex')
      .slice(0, 12)
    return `${query}::${inputHash}`
  }

  async write(key: string, data: unknown, expires?: number) {
    // TODO add persistent connection and session handling
    await this.client.connect()
    await this.client.set(key, JSON.stringify(data), {
      EX: expires ?? DEFAULT_EXPIRATION,
    })
    await this.client.disconnect()
  }

  async read<T>(key: string): Promise<T | undefined> {
    await this.client.connect()
    const data = await this.client.get(key)
    await this.client.disconnect()
    if (!data) {
      return undefined
    }
    return JSON.parse(data) as T
  }
}
