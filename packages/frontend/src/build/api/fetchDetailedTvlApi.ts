import { DetailedTvlApiResponse } from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'

export async function fetchDetailedTvlApi(
  apiUrl: string,
  http: JsonHttpClient,
): Promise<DetailedTvlApiResponse> {
  const url = 'http://localhost:9001/detailed-tvl-response.json'
  const json = await http.fetchJson(url)
  return DetailedTvlApiResponse.parse(json)
}
