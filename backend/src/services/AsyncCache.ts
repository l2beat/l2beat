import fs from 'fs'

const FILE_PATH = 'cache.json'
const id = <T>(x: T) => x

interface CacheEntry {
  serialized: any
  isDeserialized: boolean
  value: any
}

export class AsyncCache {
  private cache = new Map<string, CacheEntry | Promise<CacheEntry>>()

  constructor() {
    const file = fs.readFileSync(FILE_PATH, 'utf-8')
    const parsed = JSON.parse(file)
    for (const [k, v] of Object.entries(parsed)) {
      this.cache.set(k, {
        serialized: v,
        isDeserialized: false,
        value: undefined,
      })
    }
  }

  async getOrFetch<T>(
    key: any[],
    fetch: () => Promise<T>,
    toJSON: (t: T) => any = id,
    fromJSON: (v: any) => T = id
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

  private flush = debounce(this.flushDebounced.bind(this), 200)

  private flushDebounced() {
    const data: Record<string, any> = {}
    for (const [k, v] of this.cache.entries()) {
      if (v instanceof Promise) {
        continue
      }
      data[k] = v.serialized
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  }
}

function debounce(func: () => void, timeout = 300) {
  let timer: NodeJS.Timeout
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => func(), timeout)
  }
}
