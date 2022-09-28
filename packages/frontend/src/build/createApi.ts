import {
  ActivityApiResponse,
  TvlApiCharts,
  TvlApiResponse,
} from '@l2beat/types'
import fsx from 'fs-extra'
import path from 'path'

import { Config } from './config'

export function createApi(
  config: Config,
  tvlResponse: TvlApiResponse,
  activityResponse: ActivityApiResponse,
) {
  const urlCharts = new Map<string, TvlApiCharts>()

  urlCharts.set('scaling-tvl', tvlResponse.layers2s)
  urlCharts.set('bridges-tvl', tvlResponse.bridges)
  for (const project of [...config.layer2s, ...config.bridges]) {
    const projectData = tvlResponse.projects[project.id.toString()]
    if (!projectData) {
      continue
    }
    urlCharts.set(project.display.slug, projectData.charts)
  }
  urlCharts.set('scaling-activity', getCompatibleApi(activityResponse))

  outputCharts(urlCharts)
}

export function outputCharts(urlCharts: Map<string, TvlApiCharts>) {
  for (const [url, charts] of urlCharts) {
    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(
      path.join('build/api', `${url}.json`),
      JSON.stringify(charts),
    )
  }
}

function getCompatibleApi(apiActivity: ActivityApiResponse): TvlApiCharts {
  return {
    hourly: {
      types: ['timestamp', 'tps', ''],
      data: apiActivity.combined.data.map((d) => [d[0], getTps(d[1]), 0]),
    },
    sixHourly: {
      types: ['timestamp', 'tps', ''],
      data: apiActivity.combined.data.map((d) => [d[0], getTps(d[1]), 0]),
    },
    daily: {
      types: ['timestamp', 'tps', ''],
      data: apiActivity.combined.data.map((d) => [d[0], getTps(d[1]), 0]),
    },
  }
}

function getTps(txCount: number): number {
  const SECONDS_IN_A_DAY = 24 * 60 * 60

  return +(txCount / SECONDS_IN_A_DAY).toFixed(2)
}
