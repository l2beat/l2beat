import { bridges as allBridges, layer2s as allLayer2s } from '@l2beat/config'
import {
  AssetId,
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
  const url = backend.apiUrl + '/api/tvl'
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
  for (const project of [...allBridges, ...allLayer2s]) {
    result.projects[project.id.toString()] = {
      charts: getMockTvlApiCharts(),
      tokens: [{ assetId: AssetId.ETH, tvl: 100 }],
    }
  }
  return result
}

function getMockTvlApiCharts(): TvlApiCharts {
  let now = UnixTime.now().toStartOf('hour')
  const charts: TvlApiCharts = {
    hourly: {
      types: ['timestamp', 'eth', 'usd'],
      data: [],
    },
    sixHourly: {
      types: ['timestamp', 'eth', 'usd'],
      data: [],
    },
    daily: {
      types: ['timestamp', 'eth', 'usd'],
      data: [],
    },
  }
  for (let i = -7 * 24; i <= 0; i++) {
    const timestamp = now.add(i, 'hours')
    charts.hourly.data.push([timestamp, 50, 200])
  }
  for (let i = -30 * 4; i <= 0; i++) {
    const timestamp = now.add(i * 6, 'hours')
    charts.sixHourly.data.push([timestamp, 50, 200])
  }
  now = now.toStartOf('day')
  for (let i = -365; i <= 0; i++) {
    const timestamp = now.add(i, 'days')
    charts.daily.data.push([timestamp, 50, 200])
  }
  return charts
}
