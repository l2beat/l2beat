import { type Layer2, type WarningWithSentiment } from '@l2beat/config'
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
import { getCostsProjects } from './utils/get-costs-projects'

export async function getScalingCostsEntries() {
  const [tvl, projectsChangeReport] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])
  const projects = getCostsProjects().filter((p) => !p.isArchived)

  const entries = projects
    .map((project) =>
      getScalingCostEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl[project.id] ?? 0,
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
  project: Layer2,
  changes: ProjectChanges,
  tvl: number,
): ScalingCostsEntry {
  return {
    ...getCommonScalingEntry({ project, changes, syncStatus: undefined }),
    href: `/scaling/projects/${project.display.slug}#onchain-costs`,
    costsWarning: project.display.costsWarning,
    tvlOrder: tvl,
  }
}
