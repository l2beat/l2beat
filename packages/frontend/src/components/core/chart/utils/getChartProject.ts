import type { ChartProject } from '../Chart'

export function getChartProject<
  T extends {
    shortName: string | undefined
    name: string
    slug: string
    id: string
  },
>(project: T): ChartProject {
  return {
    id: project.id,
    slug: project.slug,
    shortName: project.shortName ?? project.name,
  }
}
