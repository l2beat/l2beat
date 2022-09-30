import { ActivityApiResponse } from '@l2beat/types'

import { fetchWithCache } from './caching/fetchWithCache'

export async function fetchActivityApi(
  apiUrl: string,
  skipCache = false,
): Promise<ActivityApiResponse> {
  const url = apiUrl + '/api/activity'

  const json = await fetchWithCache(url, skipCache)

  return ActivityApiResponse.parse(JSON.parse(json))
}
