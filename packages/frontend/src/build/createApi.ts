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
  urlCharts.set('activity', getCompatibleApi(apiActivity))

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      types: [...apiActivity.combined.types, ''],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      data: apiActivity.combined.data.map((d) => [...d, 0]),
    },
    sixHourly: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      types: [...apiActivity.combined.types, ''],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      data: apiActivity.combined.data.map((d) => [...d, 0]),
    },
    daily: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      types: [...apiActivity.combined.types, ''],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      data: apiActivity.combined.data.map((d) => [...d, 0]),
    },
  }
}
