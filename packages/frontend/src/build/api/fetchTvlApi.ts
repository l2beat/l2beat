import { layer2s as allLayer2s, bridges } from '@l2beat/config'
import {
  AssetId,
  ChainId,
  TvlApiChart,
  TvlApiCharts,
  TvlApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

interface Options {
  tvl: boolean
  excludeAssociatedTokens?: boolean
}

export async function fetchTvlApi(
  backend: Config['backend'],
  http: JsonHttpClient,
  opts: Options,
): Promise<TvlApiResponse> {
  if (backend.mock) {
    return getMockTvlApiResponse()
  }

  const url = getUrl(backend, opts)
  const json = await http.fetchJson(url)
  return TvlApiResponse.parse(json)
}

function getUrl(backend: Config['backend'], opts: Options) {
  const url = new URL(`${backend.apiUrl}/api/tvl`)
  if (opts.excludeAssociatedTokens) {
    url.searchParams.set('excludeAssociatedTokens', 'true')
  }

  return url.toString()
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
        canonical: [
          {
            assetId: AssetId.ETH,
            chain: 'ethereum',
            chainId: ChainId.ETHEREUM,
            source: 'canonical',
            usdValue: 100,
          },
        ],
        external: [
          {
            assetId: AssetId.ETH,
            chain: 'ethereum',
            chainId: ChainId.ETHEREUM,
            source: 'external',
            usdValue: 100,
          },
        ],
         native: [
          {
            assetId: AssetId.ETH,
            chain: 'ethereum',
            chainId: ChainId.ETHEREUM,
            source: 'native',
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
        canonical: [
          {
            assetId: AssetId.ETH,
            chain: 'ethereum',
            chainId: ChainId.ETHEREUM,
            source: 'canonical',
            usdValue: 100,
          },
        ],
        external: [],
        native: [],
      },
    }
  }
  return result
}

const LABELS: TvlApiChart['types'] = [
  'timestamp',
  'totalUsd',
  'canonicalUsd',
  'externalUsd',
  'nativeUsd',
  'totalEth',
  'canonicalEth',
  'externalEth',
  'nativeEth',
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
