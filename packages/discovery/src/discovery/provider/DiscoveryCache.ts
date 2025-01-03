export interface DiscoveryCache {
  set(key: string, value: string): Promise<void>
  get(key: string): Promise<string | undefined>
}

export interface CacheEntry {
  read(): string | undefined
  write(value: string): void
}
