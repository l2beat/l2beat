import { TvlApiResponse } from '@l2beat/types'

import { fetchWithCache } from './caching/getCacheOrFetch'

export async function fetchTvlApi(
  apiUrl: string,
  skipCache = false,
): Promise<TvlApiResponse> {
  const url = apiUrl + '/api/main'

  const json = await fetchWithCache(url, skipCache)

  return TvlApiResponse.parse(JSON.parse(json))
}
