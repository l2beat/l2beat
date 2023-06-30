import { TvlApiResponse } from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'

export async function fetchTvlApi(
  apiUrl: string,
  http: JsonHttpClient,
): Promise<TvlApiResponse> {
  const url = apiUrl + '/api/tvl'
  const json = await http.fetchJson(url)
  return TvlApiResponse.parse(json)
}
