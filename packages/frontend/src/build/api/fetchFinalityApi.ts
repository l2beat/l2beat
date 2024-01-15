import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export function fetchFinalityApi(
  backend: Config['backend'],
  http: JsonHttpClient,
) {
  if (backend.mock) {
    return getMockFinalityApiResponse()
  }
  throw new Error('Not implemented')
}

function getMockFinalityApiResponse() {
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
  ].reduce<Record<string, any>>((acc, cur) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    acc[cur] = generateMockData()
    return acc
  }, {})

  return {
    projects,
  }
}

function generateMockData(): any {
  return generateDataPoint()
}

function generateDataPoint(): any | undefined {
  return {
    averageInSeconds: generateRandomTime(),
    minimumInSeconds: generateRandomTime(),
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
