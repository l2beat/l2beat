import {
  type Bridge,
  type BridgeDisplay,
  type BridgeRiskView,
  bridges,
} from '@l2beat/config'
import { type ValueWithSentiment, notUndefined } from '@l2beat/shared-pure'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../scaling/tvl/utils/get-latest-tvl-usd'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import {
  type CommonBridgesEntry,
  getCommonBridgesEntry,
} from './get-common-bridges-entry'
import { getDestination } from './get-destination'

export async function getBridgeRiskEntries() {
  const [tvl, projectsVerificationStatuses, projectsChangeReport] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getProjectsVerificationStatuses(),
      getProjectsChangeReport(),
    ])

  const included = bridges.filter(
    (project) => !project.isUpcoming && !project.isArchived,
  )

  const entries = included
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]

      return getBridgesRiskEntry(project, projectsChangeReport, isVerified, tvl)
    })
    .filter(notUndefined)

  return entries.sort(compareTvl)
}

export interface BridgesRiskEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  destination: ValueWithSentiment<string>
  tvlOrder: number
  riskView: BridgeRiskView
}

function getBridgesRiskEntry(
  bridge: Bridge,
  projectsChangeReport: ProjectsChangeReport,
  isVerified: boolean,
  tvl: ProjectsLatestTvlUsd,
) {
  const hasImplementationChanged =
    projectsChangeReport.hasImplementationChanged(bridge.id.toString())
  const hasHighSeverityFieldChanged =
    projectsChangeReport.hasHighSeverityFieldChanged(bridge.id.toString())

  return {
    ...getCommonBridgesEntry({
      bridge,
      isVerified,
      hasImplementationChanged,
      hasHighSeverityFieldChanged,
    }),
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
