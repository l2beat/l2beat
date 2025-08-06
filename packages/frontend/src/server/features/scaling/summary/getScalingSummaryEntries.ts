import type {
  Project,
  ProjectScalingCapability,
  ProjectScalingCategory,
  ProjectScalingDa,
  ProjectScalingPurpose,
  ProjectScalingStack,
  ProjectScalingStage,
  ReasonForBeingInOther,
  WarningWithSentiment,
} from '@l2beat/config'
import compact from 'lodash/compact'
import type { RosetteValue } from '~/components/rosette/types'
import { getL2Risks } from '~/pages/scaling/utils/getL2Risks'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { ActivityLatestUopsData } from '../activity/getActivityLatestTps'
import { getActivityLatestUops } from '../activity/getActivityLatestTps'
import { getActivitySyncWarning } from '../activity/utils/isActivitySynced'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import { getApprovedOngoingAnomalies } from '../liveness/getApprovedOngoingAnomalies'
import type { ProjectSevenDayTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { getAssociatedTokenWarning } from '../tvs/utils/getAssociatedTokenWarning'
import { compareStageAndTvs } from '../utils/compareStageAndTvs'

export async function getScalingSummaryEntries() {
  const projects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
    optional: ['tvsInfo', 'scalingDa', 'scalingStage', 'chainConfig'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  const [
    projectsChangeReport,
    tvs,
    projectsActivity,
    projectsOngoingAnomalies,
  ] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvsBreakdown({ type: 'layer2' }),
    getActivityLatestUops(projects),
    getApprovedOngoingAnomalies(),
  ])

  const entries = projects
    .map((project) =>
      getScalingSummaryEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id.toString()],
        projectsActivity[project.id.toString()],
        !!projectsOngoingAnomalies[project.id.toString()],
      ),
    )
    .sort(compareStageAndTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingSummaryEntry extends CommonScalingEntry {
  capability: ProjectScalingCapability
  stage: ProjectScalingStage
  category: ProjectScalingCategory
  purposes: ProjectScalingPurpose[]
  stacks: ProjectScalingStack[] | undefined
  dataAvailability: ProjectScalingDa | undefined
  reasonsForBeingOther: ReasonForBeingInOther[] | undefined
  tvs: {
    breakdown:
      | (ProjectSevenDayTvsBreakdown['breakdown'] & {
          associated: number
        })
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

export function getScalingSummaryEntry(
  project: Project<
    'statuses' | 'scalingInfo' | 'scalingRisks' | 'display',
    'tvsInfo' | 'scalingDa' | 'scalingStage' | 'chainConfig'
  >,
  changes: ProjectChanges,
  latestTvs: ProjectSevenDayTvsBreakdown | undefined,
  activity: ActivityLatestUopsData[string] | undefined,
  ongoingAnomaly: boolean,
): ScalingSummaryEntry {
  const associatedTokenWarning =
    latestTvs && latestTvs.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio:
            latestTvs.associated.total / latestTvs.breakdown.total,
          name: project.name,
          associatedTokens: project.tvsInfo?.associatedTokens ?? [],
        })
      : undefined
  const associatedTokensExcludedWarnings = compact(project.tvsInfo?.warnings)
  const activitySyncWarning = activity
    ? getActivitySyncWarning(activity.syncedUntil)
    : undefined

  return {
    ...getCommonScalingEntry({
      project,
      changes,
      ongoingAnomaly,
      syncWarning: activitySyncWarning,
    }),
    stage:
      project.scalingInfo.type === 'Other' || !project.scalingStage
        ? { stage: 'NotApplicable' as const }
        : project.scalingStage,
    capability: project.scalingInfo.capability,
    category: project.scalingInfo.type,
    stacks: project.scalingInfo.stacks,
    dataAvailability: project.scalingDa,
    purposes: project.scalingInfo.purposes,
    reasonsForBeingOther: project.scalingInfo.reasonsForBeingOther,
    tvs: {
      breakdown: latestTvs?.breakdown && {
        ...latestTvs.breakdown,
        associated: latestTvs.associated.total,
      },
      change: latestTvs?.change.total,
      associatedTokensExcludedChange:
        latestTvs?.changeExcludingAssociated.total,
      associatedTokens: project.tvsInfo?.associatedTokens ?? [],
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
