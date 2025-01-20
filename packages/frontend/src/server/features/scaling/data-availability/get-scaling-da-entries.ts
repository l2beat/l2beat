import {
  type Project,
  type ProjectDataAvailability,
  ProjectService,
  type ScalingProjectCategory,
  type ScalingProjectStack,
} from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingDaEntries() {
  const [tvl, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvlUsd(),
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
        tvl[project.id],
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export interface ScalingDaEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  dataAvailability: ProjectDataAvailability
  provider: ScalingProjectStack | undefined
  tvlOrder: number
}

function getScalingDaEntry(
  project: Project<'scalingInfo' | 'statuses' | 'scalingDa'>,
  changes: ProjectChanges,
  tvl: number | undefined,
): ScalingDaEntry {
  return {
    ...getCommonScalingEntry({ project, changes }),
    category: project.scalingInfo.type,
    dataAvailability: project.scalingDa,
    provider: project.scalingInfo.stack,
    tvlOrder: tvl ?? -1,
  }
}
