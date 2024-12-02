import { type Layer2 } from '@l2beat/config'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCostsProjects } from '../costs/utils/get-costs-projects'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'

export async function getScalingCostsEntries() {
  const [tvl, projectsChangeReport, projectsVerificationStatuses] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getProjectsChangeReport(),
      getProjectsVerificationStatuses(),
    ])
  const projects = getCostsProjects()

  const entries = projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    return getScalingCostEntry(project, isVerified, projectsChangeReport)
  })

  return groupByMainCategories(orderByStageAndTvl(entries, tvl))
}

export type ScalingCostsEntry = ReturnType<typeof getScalingCostEntry>
function getScalingCostEntry(
  project: Layer2,
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
    }),
    entryType: 'costs' as const,
    href: `/scaling/projects/${project.display.slug}#onchain-costs`,
    costsWarning: project.display.costsWarning,
  }
}
