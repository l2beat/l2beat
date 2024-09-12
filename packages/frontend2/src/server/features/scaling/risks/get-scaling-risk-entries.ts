import { layer2s } from '@l2beat/config'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

export async function getScalingRiskEntries() {
  const [tvl, implementationChangeReport, projectsVerificationStatuses] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getImplementationChangeReport(),
      getProjectsVerificationStatuses(),
    ])

  const includedProjects = layer2s.filter((p) => !p.isUpcoming && !p.isArchived)

  const entries = includedProjects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]

    return {
      entryType: 'risk' as const,
      ...getCommonScalingEntry({
        project,
        isVerified,
        hasImplementationChanged,
      }),
      risks: project.riskView,
    }
  })

  return orderByTvl(entries, tvl)
}

export type ScalingRiskEntry = Awaited<
  ReturnType<typeof getScalingRiskEntries>
>[number]
