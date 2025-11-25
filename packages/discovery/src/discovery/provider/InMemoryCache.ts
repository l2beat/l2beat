import lru from 'lru_map'
import type { DiscoveryCache } from './DiscoveryCache.js'

export class InMemoryCache implements DiscoveryCache {
  private readonly lru: lru.LRUMap<string, string>
  constructor(lruSize = 100000) {
    this.lru = new lru.LRUMap(lruSize)
  }

  set(key: string, value: string): Promise<void> {
    return new Promise((resolve, _) => {
      this.lru.set(key, value)
      resolve()
    })
  }

  get(key: string): Promise<string | undefined> {
    return new Promise((resolve, _) => {
      resolve(this.lru.get(key))
    })
  }
}
