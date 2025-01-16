import {
  type Project,
  ProjectService,
  type WarningWithSentiment,
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

export async function getScalingCostsEntries() {
  const [tvl, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'costsInfo'],
      optional: ['countdowns'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingCostEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl[project.id],
      ),
    )
    .sort(compareStageAndTvl)
  return groupByTabs(entries)
}

export interface ScalingCostsEntry extends CommonScalingEntry {
  costsWarning: WarningWithSentiment | undefined
  tvlOrder: number
}

function getScalingCostEntry(
  project: Project<'statuses' | 'scalingInfo' | 'costsInfo', 'countdowns'>,
  changes: ProjectChanges,
  tvl: number | undefined,
): ScalingCostsEntry {
  return {
    ...getCommonScalingEntry({ project, changes, syncStatuses: undefined }),
    href: `/scaling/projects/${project.slug}#onchain-costs`,
    costsWarning: project.costsInfo.warning,
    tvlOrder: tvl ?? -1,
  }
}
