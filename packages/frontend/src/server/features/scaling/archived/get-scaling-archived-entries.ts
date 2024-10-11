import { layer2s, layer3s } from '@l2beat/config'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { get7dTokenBreakdown } from '../tvl/utils/get-7d-token-breakdown'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

export type ScalingArchivedEntry = Awaited<
  ReturnType<typeof getScalingArchivedEntries>
>[number]
export async function getScalingArchivedEntries() {
  const implementationChangeReport = await getImplementationChangeReport()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const tvl = await get7dTokenBreakdown({ type: 'layer2' })

  const projects = [...layer2s, ...layer3s].filter((p) => p.isArchived)

  const entries = projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]

    const latestTvl = tvl.projects[project.id.toString()]

    return {
      entryType: 'archived' as const,
      ...getCommonScalingEntry({
        project,
        isVerified,
        hasImplementationChanged,
      }),
      risks:
        project.type === 'layer2' ? getL2Risks(project.riskView) : undefined,
      totalTvl: latestTvl?.breakdown.total,
    }
  })

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [k, v.breakdown.total]),
  )

  return orderByTvl(entries, remappedForOrdering)
}
