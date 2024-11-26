import { readFileSync } from 'fs'
import { join } from 'path'

const manifest: Record<string, string> = {}
let staticPath = '/static'

/**
 * Returns correct url to the static file. Because files are content-hashed in
 * production the urls cannot be known simply though filenames. An `example.png`
 * image file might become `example-5f78e32b.png` which enables caching but
 * requires careful handling of file urls.
 */
export function asset(file: string) {
  return `${staticPath}/${manifest[file] ?? file}`
}

export function initStaticAssets() {
  try {
    const data = JSON.parse(
      readFileSync(join(__dirname, '../manifest.json'), 'utf-8'),
    )
    Object.assign(manifest, data)
    return {
      handlerPath: staticPath,
      staticPath: join(__dirname, '../static'),
      enableCache: true,
    }
  } catch {
    const random = Math.floor(Math.random() * 2 ** 16)
      .toString(16)
      .padStart(4, '0')
    staticPath = `/static-${random}`
    return {
      handlerPath: staticPath,
      staticPath: join(__dirname, '../client/static'),
      enableCache: false,
    }
  }
}
