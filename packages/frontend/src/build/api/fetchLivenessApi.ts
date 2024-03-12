import {
  LivenessApiProject,
  LivenessApiResponse,
  LivenessDataPoint,
  UnixTime,
} from '@l2beat/shared-pure'
import { range } from 'lodash'

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
  const projects = [
    'arbitrum',
    'optimism',
    'apex',
    'aevo',
    'base',
    'dydx',
    'brine',
    'linea',
    'myria',
    'scroll',
    'polygonzkevm',
  ].reduce<Record<string, LivenessApiProject>>((acc, cur) => {
    acc[cur] = generateMockData()
    return acc
  }, {})

  return {
    projects: {
      ...projects,
      polygonzkevm: {
        ...projects.polygonzkevm,
        isSynced: false,
      },
    },
  }
}

function generateMockData(): LivenessApiProject {
  return {
    batchSubmissions: {
      last30Days: generateDataPoint(),
      last90Days: generateDataPoint(),
      allTime: generateDataPoint(),
    },
    stateUpdates: {
      last30Days: generateDataPoint(),
      last90Days: generateDataPoint(),
      allTime: generateDataPoint(),
    },
    anomalies: generateAnomalies(),
    isSynced: true,
  }
}

function generateDataPoint(): LivenessDataPoint | undefined {
  const i = Math.round(Math.random() * 100)
  if (i < 10) {
    return undefined
  }
  return {
    averageInSeconds: generateRandomTime(),
    minimumInSeconds: generateRandomTime(),
    maximumInSeconds: generateRandomTime(),
  }
}

function generateAnomalies() {
  const anomaliesCount = Math.round(Math.random() * 15)
  return anomaliesCount !== 0
    ? range(anomaliesCount).map(
        () =>
          ({
            type: Math.random() > 0.5 ? 'batchSubmissions' : 'stateUpdates',
            timestamp: UnixTime.now()
              .add(
                // TODO: (liveness) should we include current day
                Math.round(Math.random() * -29) - 1,
                'days',
              )
              .add(Math.round(Math.random() * 172800), 'seconds'),
            durationInSeconds: generateRandomTime(),
          }) as const,
      )
    : []
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
