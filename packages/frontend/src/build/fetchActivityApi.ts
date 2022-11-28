import { ActivityApiResponse } from '@l2beat/types'

import { JsonHttpClient } from './caching/JsonHttpClient'

export async function fetchActivityApi(
  apiUrl: string,
  http: JsonHttpClient,
): Promise<ActivityApiResponse> {
  const url = apiUrl + '/api/activity/v2'

  const json = await http.fetchJson(url)
  return ActivityApiResponse.parse(json)
}
