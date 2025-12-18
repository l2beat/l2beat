export interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class Cache<T> {
  private store = new Map<string, CacheEntry<T>>()
  private ttl: number // in milliseconds

  constructor(ttlSeconds: number) {
    this.ttl = ttlSeconds * 1000

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60_000)
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }

    return entry.value
  }

  set(key: string, value: T): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttl,
    })
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
      }
    }
  }

  size(): number {
    return this.store.size
  }
}
