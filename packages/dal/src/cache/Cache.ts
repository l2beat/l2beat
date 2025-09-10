import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import path from 'path'
import { createClient, type RedisClientType } from 'redis'

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

    return `${query}::${queryHash}::${inputHash}`
  }

  async write(key: string, data: unknown, expires: number) {
    await this.connect()
    await this.client.set(key, JSON.stringify(data), {
      EX: expires,
    })
  }

  async read(key: string): Promise<unknown | undefined> {
    await this.connect()
    const data = await this.client.get(key)
    if (!data) {
      return undefined
    }
    return JSON.parse(data)
  }

  private async connect() {
    // opening a connection takes significant time so it's better to keep it open
    if (this.client.isReady) return
    await this.client.connect()
  }
}
