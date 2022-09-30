import { HttpClient } from '@l2beat/common'
import { ActivityApiResponse } from '@l2beat/types'

export async function fetchActivityApi(
  apiUrl: string,
  http: HttpClient,
): Promise<ActivityApiResponse> {
  const url = apiUrl + '/api/activity'

  const json = await http.fetchJson(url)

  return ActivityApiResponse.parse(JSON.parse(json))
}
