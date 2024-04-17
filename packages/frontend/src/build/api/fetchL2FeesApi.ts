import {
  L2FeesApiChart,
  L2FeesApiChartPoint,
  L2FeesApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchL2FeesApi(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<L2FeesApiResponse> {
  if (backend.mock) {
    return getMockL2FeesApiResponse()
  }
  const url = backend.apiUrl + '/api/l2-fees'
  const json = await http.fetchJson(url)
  return L2FeesApiResponse.parse(json)
}

const TYPES: L2FeesApiChart['types'] = [
  'timestamp',
  'gasPriceGwei',
  'gasPriceUsd',
]

function getMockL2FeesApiResponse(): L2FeesApiResponse {
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
  ].reduce<Record<string, L2FeesApiChart>>((acc, cur) => {
    acc[cur] = generateMockCharts()
    return acc
  }, {})

  return {
    projects,
  }
}

function generateMockCharts(): L2FeesApiChart {
  const now = UnixTime.now().toStartOf('hour')
  const charts: L2FeesApiChart = {
    types: TYPES,
    data: [],
  }
  for (let i = -7 * 24; i <= 0; i++) {
    const timestamp = now.add(i, 'hours')
    const dataPoint = getDataPoint(timestamp)
    charts.data.push(dataPoint)
  }

  return charts
}

const getDataPoint = (timestamp: UnixTime): L2FeesApiChartPoint => {
  const gwei = randomIntFromInterval(0.01, 20)
  const usd = randomIntFromInterval(0.01, 2)

  return [timestamp, gwei, usd] as const
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
