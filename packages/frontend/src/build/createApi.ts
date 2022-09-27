import { ApiMain, Charts } from '@l2beat/types'
import fsx from 'fs-extra'
import path from 'path'

import { Config } from './config'

export function createApi(config: Config, apiMain: ApiMain) {
  const urlCharts = new Map<string, Charts>()

  urlCharts.set('tvl', apiMain.layers2s)
  for (const project of [...config.layer2s, ...config.bridges]) {
    const projectData = apiMain.projects[project.id.toString()]
    if (!projectData) {
      continue
    }
    urlCharts.set(project.display.slug, projectData.charts)
  }

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
