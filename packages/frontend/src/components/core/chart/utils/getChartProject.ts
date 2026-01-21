import type { ProjectId } from '@l2beat/shared-pure'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
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
    name: project.name,
    shortName: project.shortName,
    iconUrl: getProjectIcon(project.slug),
  }
}
