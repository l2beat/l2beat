import { bridges, layer2s as allLayer2s } from '@l2beat/config'
import {
  AssetId,
  AssetType,
  ChainId,
  TvlApiChart,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchTvlApi(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<TvlApiResponse> {
  if (backend.mock) {
    return getMockTvlApiResponse()
  }
  const url = `${backend.apiUrl}/api/tvl`
  const json = await http.fetchJson(url)
  return TvlApiResponse.parse(json)
}

function getMockTvlApiResponse(): TvlApiResponse {
  const result: TvlApiResponse = {
    bridges: getMockTvlApiCharts(),
    layers2s: getMockTvlApiCharts(),
    combined: getMockTvlApiCharts(),
    projects: {},
  }
  for (const project of allLayer2s) {
    result.projects[project.id.toString()] = {
      charts: getMockTvlApiCharts(),
      tokens: {
        CBV: [
          {
            assetId: AssetId.ETH,
            chainId: ChainId.ETHEREUM,
            assetType: AssetType('CBV'),
            usdValue: 100,
          },
        ],
        EBV: [
          {
            assetId: AssetId.ETH,
            chainId: ChainId.ETHEREUM,
            assetType: AssetType('EBV'),
            usdValue: 100,
          },
        ],
        NMV: [
          {
            assetId: AssetId.ETH,
            chainId: ChainId.ETHEREUM,
            assetType: AssetType('NMV'),
            usdValue: 100,
          },
        ],
      },
    }
  }
  for (const project of bridges) {
    result.projects[project.id.toString()] = {
      charts: getMockTvlApiCharts(),
      tokens: {
        CBV: [
          {
            assetId: AssetId.ETH,
            chainId: ChainId.ETHEREUM,
            assetType: AssetType('CBV'),
            usdValue: 100,
          },
        ],
        EBV: [],
        NMV: [],
      },
    }
  }
  return result
}

const LABELS: TvlApiChart['types'] = [
  'timestamp',
  'valueUsd',
  'cbvUsd',
  'ebvUsd',
  'nmvUsd',
  'valueEth',
  'cbvEth',
  'ebvEth',
  'nmvEth',
]

const MOCK_VALUES = [60, 30, 20, 10, 5, 3, 2, 1] as const

function getMockTvlApiCharts(): TvlApiCharts {
  let now = UnixTime.now().toStartOf('hour')
  const charts: TvlApiCharts = {
    hourly: {
      types: LABELS,
      data: [],
    },
    sixHourly: {
      types: LABELS,
      data: [],
    },
    daily: {
      types: LABELS,
      data: [],
    },
  }
  for (let i = -7 * 24; i <= 0; i++) {
    const timestamp = now.add(i, 'hours')
    charts.hourly.data.push([timestamp, ...MOCK_VALUES])
  }
  for (let i = -30 * 4; i <= 0; i++) {
    const timestamp = now.add(i * 6, 'hours')
    charts.sixHourly.data.push([timestamp, ...MOCK_VALUES])
  }
  now = UnixTime.now().toStartOf('day')
  for (let i = -365; i <= 0; i++) {
    const timestamp = now.add(i, 'days')
    charts.daily.data.push([timestamp, ...MOCK_VALUES])
  }
  return charts
}
