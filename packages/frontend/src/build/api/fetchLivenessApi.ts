import { LivenessApiResponse, UnixTime } from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchLivenessApi(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<LivenessApiResponse> {
  if (backend.mock) {
    return getMockLivenessApiResponse()
  }
  const url = `${backend.apiUrl}/api/liveness`
  const json = await http.fetchJson(url)
  return LivenessApiResponse.parse(json)
}

function getMockLivenessApiResponse(): LivenessApiResponse {
  return {
    projects: {
      arbitrum: {
        batchSubmissions: {
          last30Days: {
            averageInSeconds: 120,
            maximumInSeconds: 180,
          },
          last90Days: {
            averageInSeconds: 120,
            maximumInSeconds: 180,
          },
          max: {
            averageInSeconds: 120,
            maximumInSeconds: 180,
          },
        },
        stateUpdates: {
          last30Days: {
            averageInSeconds: 120,
            maximumInSeconds: 180,
          },
          last90Days: {
            averageInSeconds: 120,
            maximumInSeconds: 180,
          },
          max: {
            averageInSeconds: 120,
            maximumInSeconds: 180,
          },
        },
        anomalies: [
          {
            timestamp: UnixTime.now().add(-3, 'days'),
            durationInSeconds: 10 * 60,
          },
          {
            timestamp: UnixTime.now().add(-29, 'days'),
            durationInSeconds: 30 * 60,
          },
        ],
      },
    },
  }
}
