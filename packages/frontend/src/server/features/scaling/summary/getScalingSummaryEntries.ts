import type {
  Project,
  ProjectAssociatedToken,
  ProjectScalingCapability,
  ProjectScalingDa,
  ProjectScalingProofSystem,
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
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { ActivityLatestUopsData } from '../activity/getActivityLatestTps'
import { getActivityLatestUops } from '../activity/getActivityLatestTps'
import { getActivitySyncWarning } from '../activity/utils/syncStatus'
import type { CommonScalingEntry } from '../getCommonScalingEntry'
import { getCommonScalingEntry } from '../getCommonScalingEntry'
import { getApprovedOngoingAnomalies } from '../liveness/getApprovedOngoingAnomalies'
import type { ProjectSevenDayTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { compareTvs } from '../tvs/utils/compareTvs'
import { getAssociatedTokenWarning } from '../tvs/utils/getAssociatedTokenWarning'

export async function getScalingSummaryEntries() {
  const projects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
    optional: ['tvsInfo', 'scalingDa', 'scalingStage', 'chainConfig'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  const zkCatalogProjects = await ps.getProjects({
    select: ['zkCatalogInfo'],
  })

  const [
    projectsChangeReport,
    tvs,
    projectsActivity,
    projectsOngoingAnomalies,
  ] = await Promise.all([
    getProjectsChangeReport(),
    get7dTvsBreakdown({
      type: 'layer2',
      excludeAssociatedTokens: false,
      includeRwaRestrictedTokens: false,
    }),
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
        zkCatalogProjects,
      ),
    )
    .sort(compareTvs)

  return groupByScalingTabs(entries)
}

export interface ScalingSummaryEntry extends CommonScalingEntry {
  capability: ProjectScalingCapability
  stage: ProjectScalingStage
  proofSystem: ProjectScalingProofSystem | undefined
  purposes: ProjectScalingPurpose[]
  stacks: ProjectScalingStack[] | undefined
  dataAvailability: ProjectScalingDa[] | undefined
  reasonsForBeingOther: ReasonForBeingInOther[] | undefined
  tvs: {
    associatedTokens: ProjectAssociatedToken[]
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
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): ScalingSummaryEntry {
  const associatedTokenWarning =
    latestTvs && latestTvs.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio:
            latestTvs.breakdown.associated / latestTvs.breakdown.total,
          name: project.name,
          associatedTokens: project.tvsInfo?.associatedTokens ?? [],
        })
      : undefined
  const associatedTokensExcludedWarnings = compact(project.tvsInfo?.warnings)
  const activitySyncWarning = getActivitySyncWarning(activity?.syncState)

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
    proofSystem: getProofSystemWithName(
      project.scalingInfo.proofSystem,
      zkCatalogProjects,
    ),
    stacks: project.scalingInfo.stacks,
    dataAvailability: project.scalingDa,
    purposes: project.scalingInfo.purposes,
    reasonsForBeingOther: project.scalingInfo.reasonsForBeingOther,
    tvs: {
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
