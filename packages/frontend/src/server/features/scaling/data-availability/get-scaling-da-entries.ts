import type {
  Project,
  ProjectDataAvailability,
  ScalingProjectCategory,
  ScalingProjectStack,
} from '@l2beat/config'
import { ProjectService } from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/utils/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'

export async function getScalingDaEntries() {
  const [tvs, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvsUsd(),
    getProjectsChangeReport(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingDa'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingDaEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs[project.id],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvs)

  return groupByTabs(entries)
}

export interface ScalingDaEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  dataAvailability: ProjectDataAvailability
  stack: ScalingProjectStack | undefined
  tvsOrder: number
}

function getScalingDaEntry(
  project: Project<'scalingInfo' | 'statuses' | 'scalingDa'>,
  changes: ProjectChanges,
  tvs: number | undefined,
): ScalingDaEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    category: project.scalingInfo.type,
    dataAvailability: project.scalingDa,
    stack: project.scalingInfo.stack,
    tvsOrder: tvs ?? -1,
  }
}
