import {
  L2CostsApiChart,
  L2CostsApiChartPoint,
  L2CostsApiResponse,
  L2CostsProjectApiCharts,
  UnixTime,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchL2CostsApi(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<L2CostsApiResponse> {
  if (backend.mock) {
    return getMockL2CostsApiResponse()
  }
  const url = backend.apiUrl + '/api/l2-costs'
  const json = await http.fetchJson(url)
  return L2CostsApiResponse.parse(json)
}

const TYPES: L2CostsApiChart['types'] = [
  'timestamp',
  'totalGas',
  'totalEth',
  'totalUsd',
  'overheadGas',
  'overheadEth',
  'overheadUsd',
  'calldataGas',
  'calldataEth',
  'calldataUsd',
  'computeGas',
  'computeEth',
  'computeUsd',
  'blobsGas',
  'blobsEth',
  'blobsUsd',
]

function getMockL2CostsApiResponse(): L2CostsApiResponse {
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
  ].reduce<Record<string, L2CostsProjectApiCharts>>((acc, cur) => {
    const withoutBlobs = cur === 'polygonzkevm' || cur === 'linea'
    acc[cur] = generateMockCharts(withoutBlobs)
    return acc
  }, {})

  return {
    combined: generateMockCharts(),
    projects,
  }
}

function generateMockCharts(withoutBlobs?: boolean): L2CostsProjectApiCharts {
  let now = UnixTime.now().toStartOf('hour')
  const charts: L2CostsProjectApiCharts = {
    hourly: {
      types: TYPES,
      data: [],
    },
    daily: {
      types: TYPES,
      data: [],
    },
    syncedUntil: now,
  }
  for (let i = -7 * 24; i <= 0; i++) {
    const timestamp = now.add(i, 'hours')
    const dataPoint = getDataPoint(timestamp, withoutBlobs)
    charts.hourly.data.push(dataPoint)
  }
  now = UnixTime.now().toStartOf('day')
  for (let i = -365; i <= 0; i++) {
    const timestamp = now.add(i, 'days')
    const dataPoint = getDataPoint(timestamp, withoutBlobs)
    charts.daily.data.push(dataPoint)
  }
  return charts
}

const getDataPoint = (
  timestamp: UnixTime,
  withoutBlobs?: boolean,
): L2CostsApiChartPoint => {
  const calldataMultiplier = Math.random() * 3
  const blobsMultiplier = Math.random()
  const computeMultiplier = Math.random() * 2
  const overheadMultiplier = Math.random() * 0.5

  const base = 7 + Math.random() * 3
  const usdMultiplier = base * 3500
  const gasMultiplier = (base + Math.random() * base) * 100000

  const calldataEth = round(base * calldataMultiplier)
  const calldataUsd = round(base * usdMultiplier * calldataMultiplier)
  const calldataGas = round(base * gasMultiplier * calldataMultiplier)
  const blobsEth = round(base * blobsMultiplier)
  const blobsUsd = round(base * usdMultiplier * blobsMultiplier)
  const blobsGas = round(base * gasMultiplier * blobsMultiplier)
  const computeEth = round(base * computeMultiplier)
  const computeUsd = round(base * usdMultiplier * computeMultiplier)
  const computeGas = round(base * gasMultiplier * computeMultiplier)
  const overheadEth = round(base * overheadMultiplier)
  const overheadUsd = round(base * usdMultiplier * overheadMultiplier)
  const overheadGas = round(base * gasMultiplier * overheadMultiplier)

  const totalEth = round(
    withoutBlobs
      ? calldataEth + computeEth + overheadEth
      : calldataEth + blobsEth + computeEth + overheadEth,
  )
  const totalUsd = round(
    withoutBlobs
      ? calldataUsd + computeUsd + overheadUsd
      : calldataUsd + blobsUsd + computeUsd + overheadUsd,
  )
  const totalGas = round(
    withoutBlobs
      ? calldataGas + computeGas + overheadGas
      : calldataGas + blobsGas + computeGas + overheadGas,
  )
  return [
    timestamp,
    totalGas,
    totalEth,
    totalUsd,
    overheadGas,
    overheadEth,
    overheadUsd,
    calldataGas,
    calldataEth,
    calldataUsd,
    computeGas,
    computeEth,
    computeUsd,
    withoutBlobs ? null : blobsGas,
    withoutBlobs ? null : blobsEth,
    withoutBlobs ? null : blobsUsd,
  ] as const
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
