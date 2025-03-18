import type {
  BridgeCategory,
  Project,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import { compact } from 'lodash'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { compareTvs } from '../scaling/tvs/utils/compare-tvs'
import type { ProjectSevenDayTvsBreakdown } from '../scaling/tvs/utils/get-7d-tvs-breakdown'
import { get7dTvsBreakdown } from '../scaling/tvs/utils/get-7d-tvs-breakdown'
import { getAssociatedTokenWarning } from '../scaling/tvs/utils/get-associated-token-warning'
import type { CommonBridgesEntry } from './get-common-bridges-entry'
import { getCommonBridgesEntry } from './get-common-bridges-entry'

export async function getBridgesSummaryEntries() {
  const [tvs7dBreakdown, projectsChangeReport, projects] = await Promise.all([
    get7dTvsBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
    ps.getProjects({
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
        tvs7dBreakdown.projects[project.id.toString()],
      ),
    )
    .sort(compareTvs)
}

export interface BridgesSummaryEntry extends CommonBridgesEntry {
  type: BridgeCategory
  tvs: TvsData
  validatedBy: TableReadyValue
  tvsOrder: number
}

interface TvsData {
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
  bridgeTvs: ProjectSevenDayTvsBreakdown | undefined,
): BridgesSummaryEntry {
  const associatedTokenWarning =
    bridgeTvs && bridgeTvs.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio:
            bridgeTvs.associated.total / bridgeTvs.breakdown.total,
          name: project.name,
          associatedTokens: project.tvlInfo.associatedTokens,
        })
      : undefined

  return {
    ...getCommonBridgesEntry({ project, changes }),
    type: project.bridgeInfo.category,
    tvs: {
      breakdown: bridgeTvs?.breakdown
        ? {
            ...bridgeTvs.breakdown,
            associated: bridgeTvs.associated.total,
          }
        : undefined,
      change: bridgeTvs?.change.total,
      associatedTokens: project.tvlInfo.associatedTokens,
      associatedTokenWarning,
      warnings: compact([
        associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
      ]),
    },
    validatedBy: project.bridgeRisks.validatedBy,
    tvsOrder: bridgeTvs?.breakdown.total ?? -1,
  }
}
