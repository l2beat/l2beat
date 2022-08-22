import { HttpClient } from '@l2beat/common'
import { ApiMain } from '@l2beat/types'
import crypto from 'crypto'
import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises'

export async function getApiMain(
  apiUrl: string,
  skipCache = false,
): Promise<ApiMain> {
  const url = apiUrl + '/api/main'

  if (!skipCache) {
    const cached = await readCachedData(url)
    if (cached) {
      return cached
    }
  }

  const http = new HttpClient()
  const response = await http.fetch(url)
  if (!response.ok) {
    throw new Error(
      `Could not get data from api (received status ${response.status})`,
    )
  }
  const json: unknown = await response.json()
  const data = ApiMain.parse(json)
  if (!skipCache) {
    await writeCachedData(url, data)
  }
  return data
}

const TEN_MINUTES_IN_MS = 10 * 60 * 1000
async function readCachedData(url: string): Promise<ApiMain | undefined> {
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
        const contents = await readFile(`cache/${file}`, 'utf-8')
        return ApiMain.parse(JSON.parse(contents))
      }
    }
  }
  return undefined
}

async function writeCachedData(url: string, data: ApiMain) {
  const hash = getUrlHash(url)
  const now = Date.now()
  await writeFile(`cache/${hash}-${now}.json`, JSON.stringify(data))
}

function getUrlHash(url: string) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 8)
}
