import {
  type Bridge,
  type BridgeDisplay,
  type BridgeRiskView,
  bridges,
} from '@l2beat/config'
import { type ValueWithSentiment } from '@l2beat/shared-pure'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../scaling/tvl/utils/get-latest-tvl-usd'
import {
  type CommonBridgesEntry,
  getCommonBridgesEntry,
} from './get-common-bridges-entry'
import { getDestination } from './get-destination'

export async function getBridgeRiskEntries() {
  const [tvl, projectsChangeReport] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])

  return bridges
    .filter((project) => !project.isUpcoming && !project.isArchived)
    .map((project) =>
      getBridgesRiskEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        tvl,
      ),
    )
    .filter((entry) => entry !== undefined)
    .sort(compareTvl)
}

export interface BridgesRiskEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  destination: ValueWithSentiment<string>
  tvlOrder: number
  riskView: BridgeRiskView
}

function getBridgesRiskEntry(
  bridge: Bridge,
  changes: ProjectChanges,
  tvl: ProjectsLatestTvlUsd,
) {
  return {
    ...getCommonBridgesEntry({ bridge, changes }),
    type: bridge.display.category,
    destination: getDestination(
      bridge.type === 'bridge'
        ? bridge.technology.destination
        : [bridge.display.name],
    ),
    tvlOrder: tvl[bridge.id] ?? 0,
    riskView: bridge.riskView,
  }
}
