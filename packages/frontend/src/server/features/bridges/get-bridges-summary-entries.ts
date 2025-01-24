import {
  type BridgeDisplay,
  type Project,
  ProjectService,
  type ScalingProjectRiskViewEntry,
  type WarningWithSentiment,
} from '@l2beat/config'
import { compact } from 'lodash'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../scaling/tvl/utils/get-7d-token-breakdown'
import { getAssociatedTokenWarning } from '../scaling/tvl/utils/get-associated-token-warning'
import {
  type CommonBridgesEntry,
  getCommonBridgesEntry,
} from './get-common-bridges-entry'

export async function getBridgesSummaryEntries() {
  const [tvl7dBreakdown, projectsChangeReport, projects] = await Promise.all([
    get7dTokenBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'bridgeInfo', 'bridgeRisks', 'tvlInfo'],
      where: ['isBridge'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  return projects
    .map((project) =>
      getBridgesSummaryEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl7dBreakdown.projects[project.id.toString()],
      ),
    )
    .sort(compareTvl)
}

export interface BridgesSummaryEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  tvl: TvlData
  validatedBy: ScalingProjectRiskViewEntry
  tvlOrder: number
}

interface TvlData {
  breakdown:
    | {
        total: number
        ether: number
        stablecoin: number
        associated: number
      }
    | undefined
  change: number | undefined
  associatedTokens: string[]
  associatedTokenWarning: WarningWithSentiment | undefined
  warnings: WarningWithSentiment[]
}

function getBridgesSummaryEntry(
  project: Project<'statuses' | 'bridgeInfo' | 'bridgeRisks' | 'tvlInfo'>,
  changes: ProjectChanges,
  bridgeTvl: LatestTvl['projects'][string] | undefined,
) {
  const associatedTokenWarning =
    bridgeTvl && bridgeTvl.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio:
            bridgeTvl.breakdown.associated / bridgeTvl.breakdown.total,
          name: project.name,
          associatedTokens: project.tvlInfo.associatedTokens,
        })
      : undefined

  return {
    ...getCommonBridgesEntry({ project, changes }),
    type: project.bridgeInfo.category,
    tvl: {
      breakdown: bridgeTvl?.breakdown,
      change: bridgeTvl?.change,
      associatedTokens: project.tvlInfo.associatedTokens,
      associatedTokenWarning,
      warnings: compact([
        associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
      ]),
    },
    validatedBy: project.bridgeRisks.validatedBy,
    tvlOrder: bridgeTvl?.breakdown.total ?? -1,
  }
}
