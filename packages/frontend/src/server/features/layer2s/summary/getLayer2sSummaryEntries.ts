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
import type { RosetteValue } from '~/components/rosette/types'
import { getL2Risks } from '~/pages/layer2s/utils/getL2Risks'
import { groupByLayer2sTabs } from '~/pages/layer2s/utils/groupByLayer2sTabs'
import { ps } from '~/server/projects'
import { getProofSystemWithName } from '~/utils/project/getProofSystemWithName'
import { optionToRange } from '~/utils/range/range'
import type { ProjectChanges } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { ActivityLatestUopsData } from '../activity/getActivityLatestTps'
import { getActivityLatestUops } from '../activity/getActivityLatestTps'
import { getActivitySyncWarning } from '../activity/utils/syncStatus'
import type { CommonLayer2sEntry } from '../getCommonLayer2sEntry'
import { getCommonLayer2sEntry } from '../getCommonLayer2sEntry'
import { getApprovedOngoingAnomalies } from '../liveness/getApprovedOngoingAnomalies'
import type { ProjectSevenDayTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../tvs/get7dTvsBreakdown'
import { compareTvs } from '../tvs/utils/compareTvs'

export async function getLayer2sSummaryEntries() {
  const { tabs } = await getLayer2sSummaryData()
  return tabs
}

/**
 * Same as getLayer2sSummaryEntries but also exposes the 7d TVS breakdown it
 * computes internally, so callers (e.g. the home page) don't have to run the
 * expensive breakdown query a second time.
 */
export async function getLayer2sSummaryData() {
  const projects = await ps.getProjects({
    select: ['statuses', 'scalingInfo', 'scalingRisks', 'display'],
    optional: [
      'tvsInfo',
      'scalingDa',
      'scalingStage',
      'chainConfig',
      'contracts',
    ],
    where: ['scalingInfo'],
    whereNot: ['archivedAt'],
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
      excludeRwaRestrictedTokens: true,
    }),
    // Only the latest and 7-days-ago records are read per project, so a 90d
    // window is plenty (it only has to cover sync lag) and much cheaper than
    // fetching a full year of rows.
    getActivityLatestUops(projects, optionToRange('90d')),
    getApprovedOngoingAnomalies(),
  ])

  const entries = projects
    .map((project) =>
      getLayer2sSummaryEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs.projects[project.id.toString()],
        projectsActivity[project.id.toString()],
        !!projectsOngoingAnomalies[project.id.toString()],
        zkCatalogProjects,
      ),
    )
    .sort(compareTvs)

  return { tabs: groupByLayer2sTabs(entries), sevenDayTvsBreakdown: tvs }
}

export interface Layer2sSummaryEntry extends CommonLayer2sEntry {
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

export function getLayer2sSummaryEntry(
  project: Project<
    'statuses' | 'scalingInfo' | 'scalingRisks' | 'display',
    'tvsInfo' | 'scalingDa' | 'scalingStage' | 'chainConfig' | 'contracts'
  >,
  changes: ProjectChanges,
  latestTvs: ProjectSevenDayTvsBreakdown | undefined,
  activity: ActivityLatestUopsData[string] | undefined,
  ongoingAnomaly: boolean,
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): Layer2sSummaryEntry {
  const activitySyncWarning = getActivitySyncWarning(activity?.syncState)

  return {
    ...getCommonLayer2sEntry({
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
      warnings: project.tvsInfo?.warnings ?? [],
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
