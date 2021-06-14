import fs from 'fs'

const PRECOMPUTED_FILE_PATH = 'cache/precomputed.json'
const CACHE_FILE_PATH = 'cache/cache.json'
const VERSION = 1

export class CacheFile {
  read() {
    const precomputed = fs.readFileSync(PRECOMPUTED_FILE_PATH, 'utf-8')
    const cache = fs.existsSync(CACHE_FILE_PATH)
      ? fs.readFileSync(CACHE_FILE_PATH, 'utf-8')
      : '{}'
    const parsedPrecomputed = JSON.parse(precomputed)
    const parsedCache = JSON.parse(cache)
    if (parsedCache._version === VERSION) {
      return { ...parsedCache, ...parsedPrecomputed }
    } else {
      return parsedPrecomputed
    }
  }

  write(data: Record<string, unknown>) {
    fs.writeFileSync(
      CACHE_FILE_PATH,
      JSON.stringify({ _version: VERSION, ...data }, null, 2),
      'utf-8'
    )
  }

  writePrecomputed(data: unknown) {
    fs.writeFileSync(
      PRECOMPUTED_FILE_PATH,
      JSON.stringify(data, null, 2),
      'utf-8'
    )
  }
}
