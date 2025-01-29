import {
  type BridgeDisplay,
  type BridgeRiskView,
  type Project,
  ProjectService,
  type Sentiment,
} from '@l2beat/config'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import { compareTvs } from '../scaling/tvs/utils/compare-tvs'
import { getProjectsLatestTvsUsd } from '../scaling/tvs/utils/get-latest-tvs-usd'
import {
  type CommonBridgesEntry,
  getCommonBridgesEntry,
} from './get-common-bridges-entry'

export async function getBridgeRiskEntries() {
  const [tvs, projectsChangeReport, projects] = await Promise.all([
    getProjectsLatestTvsUsd(),
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
        tvs[project.id],
      ),
    )
    .sort(compareTvs)
}

export interface BridgesRiskEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  destination: {
    value: string
    description?: string
    sentiment: Sentiment
  }
  riskView: BridgeRiskView
  tvsOrder: number
}

function getBridgesRiskEntry(
  project: Project<'statuses' | 'bridgeInfo' | 'bridgeRisks'>,
  changes: ProjectChanges,
  tvs: number | undefined,
) {
  return {
    ...getCommonBridgesEntry({ project, changes }),
    type: project.bridgeInfo.category,
    destination: getDestination(project.bridgeInfo.destination),
    riskView: project.bridgeRisks,
    tvsOrder: tvs ?? -1,
  }
}

function getDestination(destinations: string[]): {
  value: string
  description?: string
  sentiment: Sentiment
} {
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
