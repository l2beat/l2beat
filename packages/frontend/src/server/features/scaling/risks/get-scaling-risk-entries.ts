import { type Layer2 } from '@l2beat/config'
import { resolvedLayer2s } from '@l2beat/config/projects'
import { env } from '~/env'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'

export type ScalingRiskEntries = Awaited<
  ReturnType<typeof getScalingRiskEntries>
>
export async function getScalingRiskEntries() {
  const [tvl, implementationChangeReport, projectsVerificationStatuses] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getImplementationChangeReport(),
      getProjectsVerificationStatuses(),
    ])

  const includedProjects = resolvedLayer2s.filter(
    (p) => !p.isUpcoming && !p.isArchived,
  )

  const entries = includedProjects.map((project) =>
    getScalingRiskEntry(
      project,
      !!projectsVerificationStatuses[project.id.toString()],
      !!implementationChangeReport.projects[project.id.toString()],
    ),
  )

  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    return {
      type: 'recategorised' as const,
      entries: groupByMainCategories(orderByStageAndTvl(entries, tvl)),
    }
  }

  return { entries: orderByTvl(entries, tvl) }
}

export type ScalingRiskEntry = ReturnType<typeof getScalingRiskEntry>
function getScalingRiskEntry(
  project: Layer2,
  isVerified: boolean,
  hasImplementationChanged: boolean,
) {
  return {
    entryType: 'risk' as const,
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged,
    }),
    risks: project.riskView,
  }
}
