import { Layer2 } from '@l2beat/config'
import { ApiMain, Charts } from '@l2beat/types'

import { outputCharts } from './output'

export function createApi(projects: Layer2[], apiMain: ApiMain) {
  const urlCharts = new Map<string, Charts>()

  urlCharts.set('tvl', apiMain.charts)
  for (const project of projects) {
    const projectData = apiMain.projects[project.id.toString()]
    if (!projectData) {
      continue
    }
    urlCharts.set(project.slug, projectData.charts)
  }

  outputCharts(urlCharts)
}
