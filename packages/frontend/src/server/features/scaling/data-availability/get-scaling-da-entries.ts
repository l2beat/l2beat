import {
  type ProjectDataAvailability,
  ProjectService,
  type ProjectWith,
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
  getCommonScalingEntry2,
} from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingDaEntries() {
  const [tvl, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'scalingDa'],
      optional: ['countdowns'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingDaEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl[project.id] ?? 0,
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
  project: ProjectWith<'scalingInfo' | 'statuses' | 'scalingDa', 'countdowns'>,
  changes: ProjectChanges,
  tvl: number,
): ScalingDaEntry {
  return {
    ...getCommonScalingEntry2({ project, changes, syncStatus: undefined }),
    category: project.scalingInfo.type,
    dataAvailability: project.scalingDa,
    provider: project.scalingInfo.stack,
    tvlOrder: tvl,
  }
}
