import { layer2s, layer3s } from '@l2beat/config'
import { compact } from 'lodash'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getActivityLatestTps } from '../activity/get-activity-latest-tps'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { get7dTokenBreakdown } from '../tvl/utils/get-7d-token-breakdown'
import { getAssociatedTokenWarning } from '../tvl/utils/get-associated-token-warning'
import { orderByTvl } from '../tvl/utils/order-by-tvl'

export type ScalingSummaryEntry = Awaited<
  ReturnType<typeof getScalingSummaryEntries>
>[number]
export async function getScalingSummaryEntries() {
  const projects = [...layer2s, ...layer3s].filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )
  const [
    implementationChangeReport,
    projectsVerificationStatuses,
    tvl,
    projectsActivity,
  ] = await Promise.all([
    getImplementationChangeReport(),
    getProjectsVerificationStatuses(),
    get7dTokenBreakdown({ type: 'layer2' }),
    getActivityLatestTps(projects),
  ])

  const entries = projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[project.id.toString()]

    const latestTvl = tvl.projects[project.id.toString()]
    const activity = projectsActivity[project.id.toString()]

    const associatedTokenWarning =
      latestTvl && latestTvl.breakdown.total > 0
        ? getAssociatedTokenWarning({
            associatedRatio:
              latestTvl.breakdown.associated / latestTvl.breakdown.total,
            name: project.display.name,
            associatedTokens: project.config.associatedTokens ?? [],
          })
        : undefined
    const common = {
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
      activity: activity
        ? {
            pastDayTps: activity.pastDayTps,
            change: activity.change,
          }
        : undefined,
    }

    if (project.type === 'layer2') {
      return {
        ...common,
        risks: getL2Risks(project.riskView),
        baseLayerRisks: undefined,
        stackedRisks: undefined,
      }
    }

    const baseLayer = projects
      .filter((layer) => layer.type === 'layer2')
      .find((p) => p.id === project.hostChain)

    const projectRisks = getL2Risks(project.riskView)
    const baseLayerRisks = baseLayer
      ? getL2Risks(baseLayer.riskView)
      : undefined
    const stackedRisks =
      project.type === 'layer3' ? project.stackedRiskView : undefined
    // L3
    return {
      ...common,
      risks: stackedRisks ? getL2Risks(stackedRisks) : projectRisks,
      baseLayerRisks,
    }
  })

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [k, v.breakdown.total]),
  )

  return orderByTvl(entries, remappedForOrdering)
}
