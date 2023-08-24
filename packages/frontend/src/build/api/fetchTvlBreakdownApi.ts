import { ProjectAssetsBreakdownApiResponse } from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'

export async function fetchTvlBreakdownApi(
  apiUrl: string,
  http: JsonHttpClient,
): Promise<ProjectAssetsBreakdownApiResponse> {
  const url = apiUrl + '/api/project-assets-breakdown'
  const json = await http.fetchJson(url)
  return ProjectAssetsBreakdownApiResponse.parse(json)
}
