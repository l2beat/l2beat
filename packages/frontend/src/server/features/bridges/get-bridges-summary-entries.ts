import type {
  BridgeCategory,
  Project,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import { compact } from 'lodash'
import { groupByBridgeTabs } from '~/app/(side-nav)/bridges/_utils/group-by-bridge-tabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import type { ProjectSevenDayTvsBreakdown } from '../scaling/tvs/get-7d-tvs-breakdown'
import { get7dTvsBreakdown } from '../scaling/tvs/get-7d-tvs-breakdown'
import { compareTvs } from '../scaling/tvs/utils/compare-tvs'
import { getAssociatedTokenWarning } from '../scaling/tvs/utils/get-associated-token-warning'
import type { CommonBridgesEntry } from './get-common-bridges-entry'
import { getCommonBridgesEntry } from './get-common-bridges-entry'

export async function getBridgesSummaryEntries() {
  const [tvs7dBreakdown, projectsChangeReport, projects] = await Promise.all([
    get7dTvsBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
    ps.getProjects({
      select: ['statuses', 'bridgeInfo', 'bridgeRisks', 'tvsInfo'],
      where: ['isBridge'],
      whereNot: ['isUpcoming', 'archivedAt'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getBridgesSummaryEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvs7dBreakdown.projects[project.id.toString()],
      ),
    )
    .sort(compareTvs)

  return groupByBridgeTabs(entries)
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
  project: Project<'statuses' | 'bridgeInfo' | 'bridgeRisks' | 'tvsInfo'>,
  changes: ProjectChanges,
  bridgeTvs: ProjectSevenDayTvsBreakdown | undefined,
): BridgesSummaryEntry {
  const associatedTokenWarning =
    bridgeTvs && bridgeTvs.breakdown.total > 0
      ? getAssociatedTokenWarning({
          associatedRatio:
            bridgeTvs.associated.total / bridgeTvs.breakdown.total,
          name: project.name,
          associatedTokens: project.tvsInfo.associatedTokens,
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
      associatedTokens: project.tvsInfo.associatedTokens,
      associatedTokenWarning,
      warnings: compact([
        associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
      ]),
    },
    validatedBy: project.bridgeRisks.validatedBy,
    tvsOrder: bridgeTvs?.breakdown.total ?? -1,
  }
}
