import type { ProjectId } from '@l2beat/shared-pure'
import type { ChartProject } from '../Chart'

export function getChartProject<
  T extends {
    id: ProjectId
    slug: string
    name: string
    shortName: string | undefined
  },
>(project: T): ChartProject {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
  }
}
