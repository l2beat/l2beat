import type {
  BridgeCategory,
  Project,
  ProjectAssociatedToken,
  ProjectTechnologyChoice,
  TableReadyValue,
  WarningWithSentiment,
} from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { groupByBridgeTabs } from '~/pages/bridges/utils/groupByBridgeTabs'
import { ps } from '~/server/projects'
import type { ProjectChanges } from '../projects-change-report/getProjectsChangeReport'
import { getProjectsChangeReport } from '../projects-change-report/getProjectsChangeReport'
import type { ProjectSevenDayTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'
import { compareTvs } from '../scaling/tvs/utils/compareTvs'
import { getAssociatedTokenWarning } from '../scaling/tvs/utils/getAssociatedTokenWarning'
import type { CommonBridgesEntry } from './getCommonBridgesEntry'
import { getCommonBridgesEntry } from './getCommonBridgesEntry'

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
  governance:
    | {
        upgrade?: Pick<TableReadyValue, 'value' | 'sentiment' | 'description'>
        pause?: Pick<TableReadyValue, 'value' | 'sentiment' | 'description'>
      }
    | undefined
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
        btc: number
        other: number
        rwaPublic: number
        rwaRestricted: number
      }
    | undefined
  change: number | undefined
  associatedTokens: ProjectAssociatedToken[]
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
            bridgeTvs.breakdown.associated / bridgeTvs.breakdown.total,
          name: project.name,
          associatedTokens: project.tvsInfo.associatedTokens,
        })
      : undefined

  return {
    ...getCommonBridgesEntry({ project, changes }),
    type: project.bridgeInfo.category,
    tvs: {
      breakdown: bridgeTvs?.breakdown,
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
    governance: project.bridgeRisks.governance,
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
