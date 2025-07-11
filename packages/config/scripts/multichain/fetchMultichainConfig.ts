import { readFile, writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'

import { MultichainConfig } from './types'

const CACHE_FILE = path.join(__dirname, 'cache.json')

export async function fetchMultichainConfig(useCache?: boolean) {
  const json = await fetchWithCache(useCache)
  return MultichainConfig.parse(json)
}

async function fetchWithCache(useCache?: boolean): Promise<unknown> {
  try {
    if (useCache) {
      const content = await readFile(CACHE_FILE, 'utf-8')
      return JSON.parse(content) as unknown
    }
  } catch {
    // ignore the error and continue
  }
  const res = await fetch(
    'https://bridgeapi.anyswap.exchange/v4/tokenlistv4/all',
  )
  const json = (await res.json()) as unknown
  if (useCache) {
    await writeFile(CACHE_FILE, JSON.stringify(json))
  }
  return json
}
