import {
  type BridgeDisplay,
  type BridgeRiskView,
  type Project,
  ProjectService,
  type ValueWithSentiment,
} from '@l2beat/config'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import { getProjectsLatestTvlUsd } from '../scaling/tvl/utils/get-latest-tvl-usd'
import {
  type CommonBridgesEntry,
  getCommonBridgesEntry,
} from './get-common-bridges-entry'

export async function getBridgeRiskEntries() {
  const [tvl, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'bridgeInfo', 'bridgeRisks'],
      where: ['isBridge'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  return projects
    .map((project) =>
      getBridgesRiskEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl[project.id],
      ),
    )
    .sort(compareTvl)
}

export interface BridgesRiskEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  destination: ValueWithSentiment<string>
  riskView: BridgeRiskView
  tvlOrder: number
}

function getBridgesRiskEntry(
  project: Project<'statuses' | 'bridgeInfo' | 'bridgeRisks'>,
  changes: ProjectChanges,
  tvl: number | undefined,
) {
  return {
    ...getCommonBridgesEntry({ project, changes }),
    type: project.bridgeInfo.category,
    destination: getDestination(project.bridgeInfo.destination),
    riskView: project.bridgeRisks,
    tvlOrder: tvl ?? -1,
  }
}

function getDestination(destinations: string[]): ValueWithSentiment<string> {
  if (destinations.length === 0) {
    throw new Error('Invalid destination')
  }
  if (destinations.length === 1) {
    return { value: destinations[0]!, sentiment: 'neutral' }
  }
  return {
    value: 'Various',
    description: destinations.join(',\n'),
    sentiment: 'neutral',
  }
}
