import type {
  Project,
  ProjectDataAvailability,
  ReasonForBeingInOther,
  ScalingProjectCapability,
  ScalingProjectCategory,
  ScalingProjectPurpose,
  ScalingProjectStack,
  StageConfig,
  WarningWithSentiment,
} from '@l2beat/config'
import { compact } from 'lodash'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import type { RosetteValue } from '~/components/rosette/types'
import { ps } from '~/server/projects'
import { groupByTabs } from '~/utils/group-by-tabs'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { ActivityLatestUopsData } from '../activity/get-activity-latest-tps'
import { getActivityLatestUops } from '../activity/get-activity-latest-tps'
import { getActivitySyncWarning } from '../activity/utils/is-activity-synced'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import type { LatestTvs } from '../tvs/utils/get-7d-token-breakdown'
import { get7dTokenBreakdown } from '../tvs/utils/get-7d-token-breakdown'
import { getAssociatedTokenWarning } from '../tvs/utils/get-associated-token-warning'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'

export async function getScalingSummaryEntries() {
  const projects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
    optional: ['tvlInfo', 'scalingDa', 'scalingStage'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
  })

  const [projectsChangeReport, tvs, projectsActivity] = await Promise.all([
    getProjectsChangeReport(),
    get7dTokenBreakdown({ type: 'layer2' }),
    getActivityLatestUops(projects),
  ])

  const entries = projects
    .map((project) =>
      getScalingSummaryEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id.toString()],
        projectsActivity[project.id.toString()],
      ),
    )
    .sort(compareStageAndTvs)

  return groupByTabs(entries)
}

export interface ScalingSummaryEntry extends CommonScalingEntry {
  capability: ScalingProjectCapability
  stage: StageConfig
  category: ScalingProjectCategory
  purposes: ScalingProjectPurpose[]
  stack: ScalingProjectStack | undefined
  dataAvailability: ProjectDataAvailability | undefined
  reasonsForBeingOther: ReasonForBeingInOther[] | undefined
  tvs: {
    breakdown:
      | {
          total: number
          ether: number
          stablecoin: number
          associated: number
        }
      | undefined
    change: number | undefined
    associatedTokensExcludedChange: number | undefined
    associatedTokens: string[]
    warnings: WarningWithSentiment[]
    associatedTokensExcludedWarnings: WarningWithSentiment[]
  }
  activity:
    | {
        pastDayUops: number
        change: number
        isSynced: boolean
      }
    | undefined
  tvsOrder: number
  risks: RosetteValue[]
  baseLayerRisks: RosetteValue[] | undefined
}

function getScalingSummaryEntry(
  project: Project<
    'statuses' | 'scalingInfo' | 'scalingRisks' | 'display',
    'tvlInfo' | 'scalingDa' | 'scalingStage'
  >,
  changes: ProjectChanges,
  latestTvs: LatestTvs['projects'][string] | undefined,
  activity: ActivityLatestUopsData[string] | undefined,
): ScalingSummaryEntry {
  const associatedTokenWarning =
    latestTvs && latestTvs.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio:
            latestTvs.breakdown.associated / latestTvs.breakdown.total,
          name: project.name,
          associatedTokens: project.tvlInfo?.associatedTokens ?? [],
        })
      : undefined
  const associatedTokensExcludedWarnings = compact(project.tvlInfo?.warnings)
  const activitySyncWarning = activity
    ? getActivitySyncWarning(activity.syncedUntil)
    : undefined

  return {
    ...getCommonScalingEntry({
      project,
      changes,
      syncWarning: activitySyncWarning,
    }),
    stage:
      project.scalingInfo.isOther || !project.scalingStage
        ? { stage: 'NotApplicable' as const }
        : project.scalingStage,
    capability: project.scalingInfo.capability,
    category: project.scalingInfo.type,
    stack: project.scalingInfo.stack,
    dataAvailability: project.scalingDa,
    purposes: project.scalingInfo.purposes,
    reasonsForBeingOther: project.scalingInfo.reasonsForBeingOther,
    tvs: {
      breakdown: latestTvs?.breakdown,
      change: latestTvs?.change,
      associatedTokensExcludedChange: latestTvs?.associatedTokensExcludedChange,
      associatedTokens: project.tvlInfo?.associatedTokens ?? [],
      warnings: compact([
        ...associatedTokensExcludedWarnings,
        associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
      ]),
      associatedTokensExcludedWarnings,
    },
    activity: activity && {
      pastDayUops: activity.pastDayUops,
      change: activity.change,
      isSynced: !activitySyncWarning,
    },
    tvsOrder: latestTvs?.breakdown.total ?? -1,
    risks: getL2Risks(
      project.scalingRisks.stacked ?? project.scalingRisks.self,
    ),
    baseLayerRisks: project.scalingRisks.host
      ? getL2Risks(project.scalingRisks.host)
      : undefined,
  }
}
