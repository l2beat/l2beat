import { DiffHistoryApiResponse } from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchDiffHistory(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<DiffHistoryApiResponse> {
  const url = `${backend.apiUrl}/diff-history`
  const json = await http.fetchJson(url)
  return DiffHistoryApiResponse.parse(json)
}
