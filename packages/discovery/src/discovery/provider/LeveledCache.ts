import type { DiscoveryCache } from './DiscoveryCache.js'

export class LeveledCache implements DiscoveryCache {
  constructor(
    private readonly l1: DiscoveryCache,
    private readonly l2: DiscoveryCache,
  ) {}

  async set(key: string, value: string): Promise<void> {
    await this.l1.set(key, value)
    await this.l2.set(key, value)
  }

  async get(key: string): Promise<string | undefined> {
    const l1Result = await this.l1.get(key)
    if (l1Result !== undefined) {
      return l1Result
    }

    const l2Result = await this.l2.get(key)
    if (l2Result === undefined) {
      return undefined
    }

    await this.l1.set(key, l2Result)
    return l2Result
  }
}
