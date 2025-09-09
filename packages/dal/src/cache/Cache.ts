import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import path from 'path'
import { createClient, type RedisClientType } from 'redis'

const DEFAULT_EXPIRATION = 60 // 1 minute

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

  generateKey(query: string, input: unknown): string {
    // generate hash of the query file contents and input
    // to ensure that if the query changes, the cache is invalidated
    const queryFilePath = path.join(__dirname, `../queries/${query}.ts`)
    const file = readFileSync(queryFilePath, 'utf8')
    const queryHash = createHash('md5').update(file).digest('hex').slice(0, 12)

    // also hash the input to ensure that different inputs generate different keys
    const inputHash = createHash('md5')
      .update(JSON.stringify(input))
      .digest('hex')
      .slice(0, 12)

    return `${query}::${queryHash}::${inputHash}-2`
  }

  async write(key: string, data: unknown, expires?: number) {
    // TODO add persistent connection and session handling
    await this.client.connect()
    await this.client.set(key, JSON.stringify(data), {
      EX: expires ?? DEFAULT_EXPIRATION,
    })
    await this.client.disconnect()
  }

  async read(key: string): Promise<unknown | undefined> {
    await this.client.connect()
    const data = await this.client.get(key)
    await this.client.disconnect()
    if (!data) {
      return undefined
    }
    return JSON.parse(data)
  }
}
