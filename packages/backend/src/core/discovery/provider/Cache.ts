import fs from 'fs'
import { debounce } from 'lodash'

export class ProviderCache {
  private readonly fileName
  private initialized = false
  private cache: Record<string, unknown> = {}

  constructor(blockNumber: number) {
    this.fileName = `cache/discovery/${blockNumber}.json`
  }

  init() {
    if (this.initialized || !fs.existsSync(this.fileName)) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.cache = JSON.parse(fs.readFileSync(this.fileName, 'utf8'))
    this.initialized = true
  }

  get(key: string) {
    this.init()
    return this.cache[key]
  }

  has(key: string) {
    return key in this.cache
  }

  set(key: string, value: unknown) {
    this.cache[key] = value
    this.flush()
  }

  private readonly flush = debounce(this.save.bind(this))

  private save() {
    if (!fs.existsSync('cache')) {
      fs.mkdirSync('cache')
    }
    if (!fs.existsSync('cache/discovery')) {
      fs.mkdirSync('cache/discovery')
    }
    fs.writeFileSync(this.fileName, JSON.stringify(this.cache, null, 2))
  }
}
