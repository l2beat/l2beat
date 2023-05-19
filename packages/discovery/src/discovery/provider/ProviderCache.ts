import fs from 'fs'
import { debounce } from 'lodash'
import { mkdirpSync } from 'mkdirp'
import path from 'path'

const DIR = 'cache/discovery'

export class ProviderCache {
  // filename -> key -> value
  private cache: Record<string, Record<string, unknown>> = {}

  private load(filename: string) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.cache[filename] !== undefined) {
      return
    }
    const file = `${DIR}/${filename}.json`
    if (!fs.existsSync(file)) {
      this.cache[filename] = {}
      return
    }
    const item = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<
      string,
      unknown
    >
    this.cache[filename] = item
  }

  get(filename: string, key: string) {
    this.load(filename)
    return this.cache[filename][key]
  }

  set(filename: string, key: string, value: unknown) {
    this.load(filename)
    this.cache[filename][key] = value
    this.flush(filename)
  }

  private readonly flush = debounce(this.save.bind(this))

  private save(filename: string) {
    const file = `${DIR}/${filename}.json`
    mkdirpSync(path.dirname(file))
    fs.writeFileSync(file, JSON.stringify(this.cache[filename], null, 2))
  }
}
