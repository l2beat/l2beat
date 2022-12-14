import { readFile, writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'

import { MultichainConfig } from './types'

const USE_CACHE = !!process.env.USE_CACHE
const CACHE_FILE = path.join(__dirname, 'cache.json')

export async function fetchMultichainConfig() {
  const json = await fetchWithCache()
  return MultichainConfig.parse(json)
}

async function fetchWithCache(): Promise<unknown> {
  try {
    if (USE_CACHE) {
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
  if (USE_CACHE) {
    await writeFile(CACHE_FILE, JSON.stringify(json))
  }
  return json
}
