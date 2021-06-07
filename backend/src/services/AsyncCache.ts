import { CacheFile } from './CacheFile'

const id = <T>(x: T) => x

interface CacheEntry {
  serialized: unknown
  isDeserialized: boolean
  value: unknown
}

interface Key {
  toString(): string
}

export class AsyncCache {
  private cache = new Map<string, CacheEntry | Promise<CacheEntry>>()

  constructor(private cacheFile: CacheFile, private debounceTimeout = 200) {
    const contents = this.cacheFile.read()
    for (const [k, v] of Object.entries(contents)) {
      this.cache.set(k, {
        serialized: v,
        isDeserialized: false,
        value: undefined,
      })
    }
  }

  async getOrFetch<T>(key: Key[], fetch: () => Promise<T>): Promise<T>
  async getOrFetch<T, U>(
    key: Key[],
    fetch: () => Promise<T>,
    toJSON: (t: T) => U,
    fromJSON: (v: U) => T
  ): Promise<T>
  async getOrFetch(
    key: Key[],
    fetch: () => Promise<unknown>,
    toJSON = id,
    fromJSON = id
  ) {
    const keyString = key.toString()
    const cached = this.cache.get(keyString)
    if (cached) {
      const resolved = await cached
      if (!resolved.isDeserialized) {
        resolved.isDeserialized = true
        resolved.value = fromJSON(resolved.serialized)
      }
      return resolved.value
    }
    const promise = fetch().then(
      (value): CacheEntry => ({
        isDeserialized: true,
        value,
        serialized: toJSON(value),
      })
    )
    this.cache.set(keyString, promise)
    promise.then((e) => {
      this.cache.set(keyString, e)
      this.flush()
    })
    return promise.then((x) => x.value)
  }

  private flush = debounce(this.flushDebounced.bind(this), this.debounceTimeout)

  private flushDebounced() {
    const data: Record<string, unknown> = {}
    for (const [k, v] of this.cache.entries()) {
      if (v instanceof Promise) {
        continue
      }
      data[k] = v.serialized
    }
    this.cacheFile.write(data)
  }
}

function debounce(func: () => void, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => func(), timeout)
  }
}
