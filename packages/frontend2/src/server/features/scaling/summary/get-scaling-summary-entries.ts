import { layer2s, layer3s } from '@l2beat/config'
import { compact } from 'lodash'
import { getL2Risks } from '~/app/(new)/(other)/scaling/_utils/get-l2-risks'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { get7dTvlBreakdown } from '../tvl/utils/get-7d-tvl-breakdown'
import { getAssociatedTokenWarning } from '../tvl/utils/get-associated-token-warning'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

export async function getScalingSummaryEntries() {
  const implementationChangeReport = await getImplementationChangeReport()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()
  const tvl = await get7dTvlBreakdown()

  const projects = [...layer2s, ...layer3s]

  const entries = projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]

    const latestTvl = tvl.projects[project.id.toString()]

    const associatedTokenWarning =
      latestTvl && latestTvl.breakdown.total > 0
        ? getAssociatedTokenWarning({
            associatedRatio:
              latestTvl.breakdown.associated / latestTvl.breakdown.total,
            name: project.display.name,
            associatedTokens: project.config.associatedTokens ?? [],
          })
        : undefined

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
        warnings: compact([
          project.display.tvlWarning,
          associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
        ]),
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
