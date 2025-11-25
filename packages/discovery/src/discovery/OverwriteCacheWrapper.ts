import type { DiscoveryCache } from './provider/DiscoveryCache.js'

export class OverwriteCacheWrapper implements DiscoveryCache {
  constructor(private readonly cache: DiscoveryCache) {}

  get(_key: string): Promise<string | undefined> {
    // Return undefined to force the caller to "set" the value
    return Promise.resolve(undefined)
  }

  set(key: string, value: string): Promise<void> {
    return this.cache.set(key, value)
  }
}
