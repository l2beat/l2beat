import {
  L2CostsApiChart,
  L2CostsApiChartPoint,
  L2CostsApiCharts,
  L2CostsApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

export function fetchL2CostsApi(): L2CostsApiResponse {
  return getMockL2CostsApiResponse()
}

// export async function fetchL2CostsApi(
//   backend: Config['backend'],
//   http: JsonHttpClient,
// ): Promise<L2CostsApiResponse> {
//   if (backend.mock) {
//     return getMockL2CostsApiResponse()
//   }
//   const url = backend.apiUrl + '/api/l2-costs'
//   const json = await http.fetchJson(url)
//   return L2CostsApiResponse.parse(json)
// }

function getMockL2CostsApiResponse(): L2CostsApiResponse {
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
  ].reduce<Record<string, L2CostsApiCharts>>((acc, cur) => {
    const withoutBlobs = cur === 'honeypot' || cur === 'kroma'
    acc[cur] = generateMockCharts(withoutBlobs)
    return acc
  }, {})

  return {
    combined: generateMockCharts(),
    projects,
  }
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

function generateMockCharts(withoutBlobs?: boolean): L2CostsApiCharts {
  let now = UnixTime.now().toStartOf('hour')
  const charts: L2CostsApiCharts = {
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
  const calldataMultiplier = Math.random()
  const blobsMultiplier = Math.random()
  const computeMultiplier = Math.random()
  const overheadMultiplier = Math.random()

  const base = Math.random() * 10
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
    blobsGas,
    blobsEth,
    blobsUsd,
  ] as const
}

function round(value: number) {
  return Math.round(value * 100) / 100
}
