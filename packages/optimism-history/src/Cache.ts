import fs from 'fs'

const CACHE_LOCATION = '.cache'

export class Cache<T = unknown> {
  private cache: Record<string, T | undefined> = {}
  private initialized = false
  private filename = `${CACHE_LOCATION}/cache.json`

  constructor(filename?: string) {
    if (filename) {
      this.filename = `${CACHE_LOCATION}/${filename}`
    }
  }

  init() {
    if (this.initialized || !fs.existsSync(this.filename)) {
      return
    }
    this.cache = JSON.parse(fs.readFileSync(this.filename, 'utf8'))
    this.initialized = true
  }

  get(key: string) {
    this.init()
    return this.cache[key]
  }

  has(key: string) {
    this.init()
    return key in this.cache
  }

  set(key: string, value: T) {
    this.cache[key] = value
    this.flush()
  }

  private flush = debounce(this.save.bind(this))

  private save() {
    if (!fs.existsSync(CACHE_LOCATION)) {
      fs.mkdirSync(CACHE_LOCATION)
    }
    fs.writeFileSync(this.filename, JSON.stringify(this.cache, null, 2))
  }
}

function debounce(func: () => void, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => func(), timeout)
  }
}
