import { type Layer2 } from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import { getCostsProjects } from './utils/get-costs-projects'

export async function getScalingCostsEntries() {
  const [tvl, projectsChangeReport] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])
  const projects = getCostsProjects()

  const entries = projects
    .map((project) =>
      getScalingCostEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl,
      ),
    )
    .sort(compareStageAndTvl)
  return groupByTabs(entries)
}

export type ScalingCostsEntry = ReturnType<typeof getScalingCostEntry>
function getScalingCostEntry(
  project: Layer2,
  changes: ProjectChanges,
  tvl: ProjectsLatestTvlUsd,
) {
  return {
    ...getCommonScalingEntry({ project, changes, syncStatus: undefined }),
    href: `/scaling/projects/${project.display.slug}#onchain-costs`,
    costsWarning: project.display.costsWarning,
    tvlOrder: tvl[project.id] ?? 0,
  }
}
