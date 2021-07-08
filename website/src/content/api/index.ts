import { Project } from '@l2beat/config'
import { ChartData, L2Data } from '../L2Data'
import { outputCharts } from './output'

export function createApi(projects: Project[], data: L2Data) {
  const charts = new Map<string, ChartData>()

  charts.set('tvl', data.aggregate)
  for (const project of projects) {
    const projectData = data.byProject[project.name]
    charts.set(project.slug, projectData.aggregate)
    for (const [token, chart] of Object.entries(projectData.byToken)) {
      charts.set(`${project.slug}/${token.toLowerCase()}`, chart)
    }
  }

  outputCharts(charts)
}
