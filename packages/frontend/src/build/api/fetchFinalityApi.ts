import {
  FinalityApiResponse,
  FinalityDataPoint,
  FinalityProjectData,
  UnixTime,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchFinalityApi(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<FinalityApiResponse> {
  if (backend.mock) {
    return getMockFinalityApiResponse()
  }
  const url = backend.apiUrl + '/api/finality'
  const json = await http.fetchJson(url)
  return FinalityApiResponse.parse(json)
}

function getMockFinalityApiResponse(): FinalityApiResponse {
  const projects = [
    'zksyncera',
    'base',
    'optimism',
    'honeypot',
    'fuelv1',
    'kroma',
    'mode',
    'zksync2',
    'zora',
    'starknet',
  ].reduce<Record<string, FinalityProjectData>>((acc, cur) => {
    acc[cur] = {
      timeToInclusion: generateMockData(),
      stateUpdateDelays: generateMockData(),
      syncedUntil: UnixTime.now(),
    }
    return acc
  }, {})

  return {
    projects: {
      ...projects,
      optimism: {
        ...projects.optimism,
        syncedUntil: UnixTime.now().add(-2, 'days'),
      },
    },
  }
}

function generateMockData(): FinalityDataPoint {
  return {
    minimumInSeconds:
      generateRandomTime() < 3000 ? undefined : generateRandomTime(),
    averageInSeconds: generateRandomTime(),
    maximumInSeconds: generateRandomTime(),
  }
}

function generateRandomTime() {
  const i = Math.round(Math.random() * 100)
  if (i < 50) {
    return Math.round(Math.random() * 3600)
  }
  if (i < 90) {
    return 3600 + Math.round(Math.random() * 82800)
  }
  return 86400 + Math.round(Math.random() * 86400 * 5)
}
