import { ApiMain, Charts } from '@l2beat/common'
import { Project } from '@l2beat/config'

import { outputCharts } from './output'

export function createApi(projects: Project[], apiMain: ApiMain) {
  const urlCharts = new Map<string, Charts>()

  urlCharts.set('tvl', apiMain.charts)
  for (const project of projects) {
    const projectData = apiMain.projects[project.name]
    if (!projectData) {
      continue
    }
    urlCharts.set(project.slug, projectData.charts)
  }

  outputCharts(urlCharts)
}
