import { ApiMain, Charts } from '@l2beat/types'

import { Config } from '../config'
import { outputCharts } from './output'

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
