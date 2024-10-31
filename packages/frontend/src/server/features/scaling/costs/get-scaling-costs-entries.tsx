import { type Layer2 } from '@l2beat/config'
import { env } from '~/env'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCostsProjects } from '../costs/utils/get-costs-projects'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'

export async function getScalingCostsEntries() {
  const [tvl, implementationChange, projectsVerificationStatuses] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getImplementationChangeReport(),
      getProjectsVerificationStatuses(),
    ])
  const projects = getCostsProjects()

  const entries = projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChange.projects[project.id.toString()]
    return getScalingCostEntry(project, isVerified, hasImplementationChanged)
  })

  if (env.FEATURE_FLAG_RECATEGORISATION) {
    return {
      type: 'recategorised' as const,
      entries: groupByMainCategories(orderByStageAndTvl(entries, tvl)),
    }
  }

  return { entries: orderByTvl(entries, tvl) }
}

export type ScalingCostsEntry = ReturnType<typeof getScalingCostEntry>
function getScalingCostEntry(
  project: Layer2,
  isVerified: boolean,
  hasImplementationChanged: boolean,
) {
  return {
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged,
    }),
    entryType: 'costs' as const,
    costsWarning: project.display.costsWarning,
  }
}
