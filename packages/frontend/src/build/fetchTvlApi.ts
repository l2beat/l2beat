import { HttpClient } from '@l2beat/common'
import { TvlApiResponse } from '@l2beat/types'

import { ApiCache } from './ApiCache'

export async function fetchTvlApi(
  apiUrl: string,
  skipCache = false,
): Promise<TvlApiResponse> {
  const url = apiUrl + '/api/main'

  if (!skipCache) {
    const cached = await ApiCache.read(url)
    if (cached) {
      return TvlApiResponse.parse(JSON.parse(cached))
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
  const data = TvlApiResponse.parse(json)
  if (!skipCache) {
    await ApiCache.write(url, JSON.stringify(data))
  }
  return data
}
