import crypto from 'crypto'
import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises'

import { HttpClient } from '../../../../shared/build'

export class JsonHttpClient {
  constructor(
    private readonly http: HttpClient,
    private readonly skipCache: boolean,
  ) {}

  async fetchJson(url: string): Promise<unknown> {
    if (!this.skipCache) {
      const cached = await read(url)
      if (cached) {
        return JSON.parse(cached) as unknown
      }
    }

    const response = await this.http.fetch(url)
    if (!response.ok) {
      throw new Error(
        `Could not get data from api (requested: ${url}, received status ${response.status})`,
      )
    }
    const json: unknown = await response.json()

    if (!this.skipCache) {
      await write(url, JSON.stringify(json))
    }

    return json
  }
}

const TEN_MINUTES_IN_MS = 10 * 60 * 1000
async function read(url: string): Promise<string | undefined> {
  const hash = getUrlHash(url)
  const now = Date.now()
  try {
    await stat('cache')
  } catch {
    await mkdir('cache')
  }
  const files = await readdir('cache')
  for (const file of files) {
    if (file.startsWith(hash)) {
      const timestamp = Number(file.slice(9, -5))
      if (now - timestamp <= TEN_MINUTES_IN_MS) {
        return await readFile(`cache/${file}`, 'utf-8')
      }
    }
  }
  return undefined
}

async function write(url: string, data: string) {
  const hash = getUrlHash(url)
  const now = Date.now()
  await writeFile(`cache/${hash}-${now}.json`, data)
}

function getUrlHash(url: string) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 8)
}
