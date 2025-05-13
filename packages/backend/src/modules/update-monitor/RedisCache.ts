import type { DiscoveryCache } from '@l2beat/discovery'
import { createClient } from 'redis'

export class RedisCache implements DiscoveryCache {
  private client: ReturnType<typeof createClient>

  constructor(private readonly uri: string) {
    this.client = createClient({ url: this.uri })
    this.client.on('error', console.error)
  }

  private async init() {
    if (!this.client) throw new Error('Redis client not initialized')

    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  async disconnect() {
    if (!this.client) throw new Error('Redis client not initialized')
    if (this.client.isOpen) {
      await this.client.quit()
    }
  }

  async set(key: string, value: string): Promise<void> {
    await this.init()
    await this.client.set(key, value)
  }

  async get(key: string): Promise<string | undefined> {
    await this.init()
    return (await this.client.get(key)) ?? undefined
  }
}
