import { ApiActivity, ApiMain, Charts } from '@l2beat/types'
import fsx from 'fs-extra'
import path from 'path'

import { Config } from './config'

export function createApi(
  config: Config,
  apiMain: ApiMain,
  apiActivity: ApiActivity,
) {
  const urlCharts = new Map<string, Charts>()

  urlCharts.set('scaling-tvl', apiMain.layers2s)
  urlCharts.set('bridges-tvl', apiMain.bridges)
  for (const project of [...config.layer2s, ...config.bridges]) {
    const projectData = apiMain.projects[project.id.toString()]
    if (!projectData) {
      continue
    }
    urlCharts.set(project.display.slug, projectData.charts)
  }
  urlCharts.set('scaling-activity', getCompatibleApi(apiActivity))

  outputCharts(urlCharts)
}

export function outputCharts(urlCharts: Map<string, Charts>) {
  for (const [url, charts] of urlCharts) {
    fsx.mkdirpSync(path.join('build/api', path.dirname(url)))
    fsx.writeFileSync(
      path.join('build/api', `${url}.json`),
      JSON.stringify(charts),
    )
  }
}

function getCompatibleApi(apiActivity: ApiActivity): Charts {
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
