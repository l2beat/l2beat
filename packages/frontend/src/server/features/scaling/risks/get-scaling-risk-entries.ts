import { type Layer2, layer2s } from '@l2beat/config'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

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

  const includedProjects = layer2s.filter((p) => !p.isUpcoming && !p.isArchived)

  const entries = includedProjects.map((project) =>
    getScalingRiskEntry(
      project,
      !!projectsVerificationStatuses[project.id.toString()],
      !!implementationChangeReport.projects[project.id.toString()],
    ),
  )

  return orderByTvl(entries, tvl)
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
