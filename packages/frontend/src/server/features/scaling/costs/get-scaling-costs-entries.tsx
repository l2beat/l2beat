import { type Layer2 } from '@l2beat/config'
import { getProjectsVerificationStatuses } from '@l2beat/config'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCostsProjects } from '../costs/utils/get-costs-projects'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingCostsEntries() {
  const [tvl, projectsChangeReport] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])
  const projects = getCostsProjects()

  const entries = projects
    .map((project) => {
      const isVerified = getProjectsVerificationStatuses(project)
      return getScalingCostEntry(project, tvl, isVerified, projectsChangeReport)
    })
    .sort(compareStageAndTvl)
  return groupByTabs(entries)
}

export type ScalingCostsEntry = ReturnType<typeof getScalingCostEntry>
function getScalingCostEntry(
  project: Layer2,
  tvl: ProjectsLatestTvlUsd,
  isVerified: boolean,
  projectsChangeReport: ProjectsChangeReport,
) {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
      syncStatus: undefined,
    }),
    entryType: 'costs' as const,
    href: `/scaling/projects/${project.display.slug}#onchain-costs`,
    costsWarning: project.display.costsWarning,
    tvlOrder: tvl[project.id] ?? 0,
  }
}
