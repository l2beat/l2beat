import { ActivityApiResponse } from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'

export async function fetchActivityApi(
  apiUrl: string,
  http: JsonHttpClient,
): Promise<ActivityApiResponse> {
  const url = apiUrl + '/api/activity'
  const json = await http.fetchJson(url)
  return ActivityApiResponse.parse(json)
}
