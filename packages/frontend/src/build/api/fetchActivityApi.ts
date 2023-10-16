import { layer2s as allLayer2s } from '@l2beat/config'
import {
  ActivityApiChart,
  ActivityApiCharts,
  ActivityApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { JsonHttpClient } from '../caching/JsonHttpClient'
import { Config } from '../config'

export async function fetchActivityApi(
  backend: Config['backend'],
  http: JsonHttpClient,
): Promise<ActivityApiResponse> {
  if (backend.mock) {
    return getMockActivityApiResponse()
  }
  const url = backend.apiUrl + '/api/activity'
  const json = await http.fetchJson(url)
  return ActivityApiResponse.parse(json)
}

function getMockActivityApiResponse(): ActivityApiResponse {
  const result: ActivityApiResponse = {
    combined: getMockActivityApiChart(),
    projects: {},
  }
  for (const project of allLayer2s) {
    result.projects[project.id.toString()] = getMockActivityApiChart()
  }
  return result
}

function getMockActivityApiChart(): ActivityApiCharts {
  const now = UnixTime.now().toStartOf('day')
  const chart: ActivityApiChart = {
    types: ['timestamp', 'transactions', 'ethereumTransactions'],
    data: [],
  }
  for (let i = -365; i <= 0; i++) {
    const timestamp = now.add(i, 'days')
    chart.data.push([timestamp, 50, 20])
  }
  return {
    daily: chart,
  }
}
