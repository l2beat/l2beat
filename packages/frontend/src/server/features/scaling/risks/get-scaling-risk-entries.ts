import {
  ProjectService,
  type ProjectWith,
  type ScalingProjectRiskView,
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
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingRiskEntries() {
  const [tvl, projectsChangeReport] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])

  const projects = await ProjectService.STATIC.getProjects({
    select: ['statuses', 'scalingInfo', 'scalingRisks'],
    optional: ['countdowns'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
  })

  const entries = projects
    .map((project) =>
      getScalingRiskEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl,
      ),
    )
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export interface ScalingRiskEntry extends CommonScalingEntry {
  risks: ScalingProjectRiskView
  tvlOrder: number
}

function getScalingRiskEntry(
  project: ProjectWith<
    'scalingInfo' | 'statuses' | 'scalingRisks',
    'countdowns'
  >,
  changes: ProjectChanges,
  tvl: ProjectsLatestTvlUsd,
) {
  return {
    ...getCommonScalingEntry2({ project, changes, syncStatus: undefined }),
    risks: project.scalingRisks.stacked ?? project.scalingRisks.self,
    tvlOrder: tvl[project.id] ?? 0,
  }
}
