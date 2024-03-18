import {
  DiffStateApiResponse,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchDiffState(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<DiffStateApiResponse> {
  if(backend.mock) {
    return getMockDiffStateApiResponse()
  }

  const url = `${backend.apiUrl}/diff-state`
  const json = await http.fetchJson(url)
  return DiffStateApiResponse.parse(json)
}

function getMockDiffStateApiResponse(): DiffStateApiResponse {
  return {
    projects: {}
  }
}
