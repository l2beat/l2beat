import { HttpClient } from '@l2beat/common'
import { ActivityApiResponse } from '@l2beat/types'

import { ApiCache } from './ApiCache'

export async function fetchActivityApi(
  apiUrl: string,
  skipCache = false,
): Promise<ActivityApiResponse> {
  const url = apiUrl + '/api/activity'

  if (!skipCache) {
    const cached = await ApiCache.read(url)
    if (cached) {
      return ActivityApiResponse.parse(JSON.parse(cached))
    }
  }

  const http = new HttpClient()
  const response = await http.fetch(url)
  if (!response.ok) {
    throw new Error(
      `Could not get ActivityApiResponse from api (received status ${response.status})`,
    )
  }
  const json: unknown = await response.json()
  const data = ActivityApiResponse.parse(json)

  if (!skipCache) {
    await ApiCache.write(url, JSON.stringify(data))
  }

  return data
}
