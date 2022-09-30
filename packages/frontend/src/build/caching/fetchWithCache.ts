import { HttpClient } from '@l2beat/common'

import { ApiCache } from './ApiCache'

export async function fetchWithCache(
  url: string,
  skipCache: boolean,
): Promise<string> {
  if (!skipCache) {
    console.log('using cache for', url)
    const cached = await ApiCache.read(url)
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

  if (!skipCache) {
    await ApiCache.write(url, JSON.stringify(json))
  }

  return JSON.stringify(json)
}
