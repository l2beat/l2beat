import fs from 'fs'

const CACHE_LOCATION = '.cache/cache.json'

export class Cache<T> {
  private cache: Record<string, T> = {}
  private initialized = false

  init() {
    if (this.initialized || !fs.existsSync(CACHE_LOCATION)) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.cache = JSON.parse(fs.readFileSync(CACHE_LOCATION, 'utf8'))
    this.initialized = true
  }

  get(key: string) {
    this.init()
    return this.cache[key]
  }

  has(key: string) {
    return key in this.cache
  }

  set(key: string, value: T) {
    this.cache[key] = value
    this.flush()
  }

  private flush = debounce(this.save.bind(this))

  private save() {
    if (!fs.existsSync('.cache')) {
      fs.mkdirSync('.cache')
    }
    fs.writeFileSync(CACHE_LOCATION, JSON.stringify(this.cache, null, 2))
  }
}

function debounce(func: () => void, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => func(), timeout)
  }
}
