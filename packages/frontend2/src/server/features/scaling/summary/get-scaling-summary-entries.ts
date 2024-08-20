import { layer2s, layer3s } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import { getL2Risks } from '~/app/(new)/(other)/scaling/_utils/get-l2-risks'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { get7dTokenBreakdown } from '../tvl/utils/get-7d-token-breakdown'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

export async function getScalingSummaryEntries() {
  const implementationChangeReport = await getImplementationChangeReport()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const tvl = await get7dTokenBreakdown()

  const projects = [...layer2s, ...layer3s]

  const entries = projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]

    const latestTvl = tvl.projects[project.id.toString()]

    return {
      entryType: 'scaling' as const,
      ...getCommonScalingEntry({
        project,
        isVerified,
        hasImplementationChanged,
      }),
      tvl: {
        breakdown: latestTvl?.breakdown,
        change: latestTvl?.change,
        associatedTokens: project.config.associatedTokens ?? [],
        warnings: [project.display.tvlWarning].filter(notUndefined),
      },
      marketShare: latestTvl && latestTvl.breakdown.total / tvl.total,
      risks: project.type === 'layer2' ? getL2Risks(project.riskView) : [],
    }
  })

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [k, v.breakdown.total]),
  )

  return orderByTvl(entries, remappedForOrdering)
}

export type ScalingSummaryEntry = Awaited<
  ReturnType<typeof getScalingSummaryEntries>
>[number]
