import { ApiMain, Chart } from '@l2beat/common'
import { Project } from '@l2beat/config'

import { outputCharts } from './output'

export function createApi(projects: Project[], apiMain: ApiMain) {
  const charts = new Map<string, Chart>()

  charts.set('tvl', apiMain.charts.daily)
  for (const project of projects) {
    const projectData = apiMain.projects[project.name]
    if (!projectData) {
      continue
    }
    charts.set(project.slug, projectData.charts.daily)
  }

  outputCharts(charts)
}
