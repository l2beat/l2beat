import type {
  BridgeCategory,
  Project,
  ProjectTechnologyChoice,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { groupByBridgeTabs } from '~/pages/bridges/utils/group-by-bridge-tabs'
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
      select: [
        'statuses',
        'bridgeInfo',
        'bridgeRisks',
        'tvsInfo',
        'bridgeTechnology',
      ],
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
  validatedBy?: TableReadyValue
  livenessFailure: TableReadyValue | undefined
  sourceUpgradeability: TableReadyValue | undefined
  tvsOrder: number
  otherConsiderations: ProjectTechnologyChoice[] | undefined
  destination: {
    value: string
    description?: string
  }
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
  project: Project<
    'statuses' | 'bridgeInfo' | 'bridgeRisks' | 'tvsInfo' | 'bridgeTechnology'
  >,
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
    destination: getDestination(project.bridgeInfo.destination),
    validatedBy: project.bridgeRisks.validatedBy,
    livenessFailure: project.bridgeRisks.livenessFailure,
    sourceUpgradeability: project.bridgeRisks.sourceUpgradeability,
    otherConsiderations: project.bridgeTechnology.otherConsiderations,
    tvsOrder: bridgeTvs?.breakdown.total ?? -1,
  }
}

function getDestination(destinations: string[]): {
  value: string
  description?: string
} {
  assert(destinations.length > 0, 'Invalid destination')
  if (destinations.length === 1 && destinations[0]) {
    return { value: destinations[0] }
  }
  return {
    value: 'Various',
    description: destinations.join(',\n'),
  }
}
