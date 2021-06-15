import fs from 'fs'
import AdmZip from 'adm-zip'

const PRECOMPUTED_FILE_PATH = 'cache/precomputed.zip'
const CACHE_FILE_PATH = 'cache/cache.json'
const VERSION = 2

export class CacheFile {
  read() {
    const zip = new AdmZip(PRECOMPUTED_FILE_PATH)
    const precomputed = zip.readAsText('precomputed.json')

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
    const content = JSON.stringify(data)
    const zip = new AdmZip()
    zip.addFile('precomputed.json', Buffer.from(content))
    const entry = zip.getEntry('precomputed.json')
    if (entry) {
      // ensure deterministic output
      entry.header.time = new Date('1999-12-31T23:59:99.999Z')
    }
    zip.writeZip(PRECOMPUTED_FILE_PATH)
  }
}
