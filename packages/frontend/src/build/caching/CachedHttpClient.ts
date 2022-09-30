import { HttpClient } from '@l2beat/common'
import crypto from 'crypto'
import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises'
import fetch, { RequestInit, Response } from 'node-fetch'

export class CachedHttpClient {
  fetch(url: string, init?: RequestInit): Promise<Response> {
    return fetch(url, init)
  }

  async fetchJson(url: string): Promise<string> {
    const cached = await read(url)
    if (cached) {
      return cached
    }

    const http = new HttpClient()
    const response = await http.fetch(url)
    if (!response.ok) {
      throw new Error(
        `Could not get data from api (received status ${response.status})`,
      )
    }
    const json: unknown = await response.json()

    await write(url, JSON.stringify(json))

    return JSON.stringify(json)
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
