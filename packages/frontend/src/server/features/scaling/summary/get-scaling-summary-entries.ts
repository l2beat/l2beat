import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { compact } from 'lodash'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { env } from '~/env'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import {
  type ActivityLatestUopsData,
  getActivityLatestUops,
} from '../activity/get-activity-latest-tps'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../tvl/utils/get-7d-token-breakdown'
import { getAssociatedTokenWarning } from '../tvl/utils/get-associated-token-warning'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'

export type ScalingSummaryEntry = Awaited<
  ReturnType<typeof getScalingSummaryEntry>
>
export async function getScalingSummaryEntries() {
  const projects = [...layer2s, ...layer3s].filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )
  const [
    projectsChangeReport,
    projectsVerificationStatuses,
    tvl,
    projectsActivity,
  ] = await Promise.all([
    getProjectsChangeReport(),
    getProjectsVerificationStatuses(),
    get7dTokenBreakdown({ type: 'layer2' }),
    getActivityLatestUops(projects),
  ])

  const entries = projects.map((project) => {
    const isVerified = !!projectsVerificationStatuses[project.id.toString()]
    const latestTvl = tvl.projects[project.id.toString()]
    const activity = projectsActivity[project.id.toString()]

    return getScalingSummaryEntry(
      project,
      isVerified,
      projectsChangeReport.hasImplementationChanged(project.id),
      projectsChangeReport.hasHighSeverityFieldChanged(project.id),
      latestTvl,
      activity,
    )
  })

  // Use data we already pulled instead of fetching it again
  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl.projects).map(([k, v]) => [k, v.breakdown.total]),
  )

  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    return {
      type: 'recategorised' as const,
      entries: groupByMainCategories(
        orderByStageAndTvl(entries, remappedForOrdering),
      ),
    }
  }

  return {
    entries: orderByTvl(entries, remappedForOrdering),
  }
}

function getScalingSummaryEntry(
  project: Layer2 | Layer3,
  isVerified: boolean,
  hasImplementationChanged: boolean,
  hasHighSeverityFieldChanged: boolean,
  latestTvl: LatestTvl['projects'][string] | undefined,
  activity: ActivityLatestUopsData[string] | undefined,
) {
  const associatedTokenWarning =
    latestTvl && latestTvl.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio:
            latestTvl.breakdown.associated / latestTvl.breakdown.total,
          name: project.display.name,
          associatedTokens: project.config.associatedTokens ?? [],
        })
      : undefined
  const associatedTokensExcludedWarnings = compact([project.display.tvlWarning])

  const common = {
    entryType: 'scaling' as const,
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged,
      hasHighSeverityFieldChanged,
    }),
    dataAvailability: project.dataAvailability,
    mainPermissions: project.display.mainPermissions,
    tvl: {
      breakdown: latestTvl?.breakdown,
      change: latestTvl?.change,
      associatedTokensExcludedChange: latestTvl?.associatedTokensExcludedChange,
      associatedTokens: project.config.associatedTokens ?? [],
      warnings: compact([
        ...associatedTokensExcludedWarnings,
        associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
      ]),
      associatedTokensExcludedWarnings,
    },
    activity: activity
      ? {
          pastDayUops: activity.pastDayUops,
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

  const baseLayer = layer2s.find((p) => p.id === project.hostChain)

  const projectRisks = getL2Risks(project.riskView)
  const baseLayerRisks = baseLayer ? getL2Risks(baseLayer.riskView) : undefined
  const stackedRisks =
    project.type === 'layer3' ? project.stackedRiskView : undefined
  // L3
  return {
    ...common,
    risks: stackedRisks ? getL2Risks(stackedRisks) : projectRisks,
    baseLayerRisks,
  }
}
