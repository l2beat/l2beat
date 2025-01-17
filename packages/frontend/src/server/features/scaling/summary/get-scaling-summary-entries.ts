import {
  type Project,
  type ProjectDataAvailability,
  ProjectService,
  type ScalingProjectCategory,
  type ScalingProjectStack,
  type StageConfig,
  type WarningWithSentiment,
} from '@l2beat/config'
import { type ReasonForBeingInOther } from '@l2beat/config/build/src/common/ReasonForBeingInOther'
import { compact } from 'lodash'
import { getL2Risks } from '~/app/(side-nav)/scaling/_utils/get-l2-risks'
import { type RosetteValue } from '~/components/rosette/types'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type ActivityLatestUopsData,
  getActivityLatestUops,
} from '../activity/get-activity-latest-tps'
import { getActivityNotSyncedStatus } from '../activity/utils/get-activity-not-synced-status'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../tvl/utils/get-7d-token-breakdown'
import { getAssociatedTokenWarning } from '../tvl/utils/get-associated-token-warning'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'

export async function getScalingSummaryEntries() {
  const projects = await ProjectService.STATIC.getProjects({
    select: ['statuses', 'scalingInfo', 'scalingRisks'],
    optional: ['countdowns', 'tvlInfo', 'scalingDa', 'scalingStage'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
  })

  const [projectsChangeReport, tvl, projectsActivity] = await Promise.all([
    getProjectsChangeReport(),
    get7dTokenBreakdown({ type: 'layer2' }),
    getActivityLatestUops(projects),
  ])

  const entries = projects
    .map((project) =>
      getScalingSummaryEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl.projects[project.id.toString()],
        projectsActivity[project.id.toString()],
      ),
    )
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export interface ScalingSummaryEntry extends CommonScalingEntry {
  stage: StageConfig
  category: ScalingProjectCategory
  provider: ScalingProjectStack | undefined
  dataAvailability: ProjectDataAvailability | undefined
  reasonsForBeingOther: ReasonForBeingInOther[] | undefined
  tvl: {
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
  tvlOrder: number
  risks: RosetteValue[]
  baseLayerRisks: RosetteValue[] | undefined
}

function getScalingSummaryEntry(
  project: Project<
    'statuses' | 'scalingInfo' | 'scalingRisks',
    'countdowns' | 'tvlInfo' | 'scalingDa' | 'scalingStage'
  >,
  changes: ProjectChanges,
  latestTvl: LatestTvl['projects'][string] | undefined,
  activity: ActivityLatestUopsData[string] | undefined,
): ScalingSummaryEntry {
  const associatedTokenWarning =
    latestTvl && latestTvl.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio:
            latestTvl.breakdown.associated / latestTvl.breakdown.total,
          name: project.name,
          associatedTokens: project.tvlInfo?.associatedTokens ?? [],
        })
      : undefined
  const associatedTokensExcludedWarnings = compact(project.tvlInfo?.warnings)

  const activityNotSyncedStatus = activity
    ? getActivityNotSyncedStatus(activity.syncedUntil)
    : undefined

  return {
    ...getCommonScalingEntry({
      project,
      changes,
      notSyncedStatuses: [activityNotSyncedStatus],
    }),
    stage:
      project.scalingInfo.isOther || !project.scalingStage
        ? { stage: 'NotApplicable' as const }
        : project.scalingStage,
    category: project.scalingInfo.type,
    provider: project.scalingInfo.stack,
    dataAvailability: project.scalingDa,
    reasonsForBeingOther: project.countdowns?.otherMigration?.reasons,
    tvl: {
      breakdown: latestTvl?.breakdown,
      change: latestTvl?.change,
      associatedTokensExcludedChange: latestTvl?.associatedTokensExcludedChange,
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
      isSynced: !activityNotSyncedStatus,
    },
    tvlOrder: latestTvl?.breakdown.total ?? -1,
    risks: getL2Risks(
      project.scalingRisks.stacked ?? project.scalingRisks.self,
    ),
    baseLayerRisks: project.scalingRisks.host
      ? getL2Risks(project.scalingRisks.host)
      : undefined,
  }
}
