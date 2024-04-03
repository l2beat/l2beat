import { FeaturesApiResponse } from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchFeaturesApi(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<Record<string, boolean>> {
  if (backend.mock) {
    return {}
  }

  const url = `${backend.apiUrl}/features`
  const json = await http.fetchJson(url)
  return FeaturesApiResponse.parse(json)
}
