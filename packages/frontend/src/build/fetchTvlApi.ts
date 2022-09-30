import { HttpClient } from '@l2beat/common'
import { TvlApiResponse } from '@l2beat/types'

export async function fetchTvlApi(
  apiUrl: string,
  http: HttpClient,
): Promise<TvlApiResponse> {
  const url = apiUrl + '/api/main'

  const json = await http.fetchJson(url)

  return TvlApiResponse.parse(JSON.parse(json))
}
