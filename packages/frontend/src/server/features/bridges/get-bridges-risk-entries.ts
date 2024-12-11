import { type Bridge, bridges } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import {
  ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../scaling/tvl/utils/get-latest-tvl-usd'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getCommonBridgesEntry } from './get-common-bridges-entry'
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
    isArchived: bridge.isArchived,
    destination: getDestination(
      bridge.type === 'bridge'
        ? bridge.technology.destination
        : [bridge.display.name],
    ),
    tvlOrder: tvl[bridge.id] ?? 0,
    ...bridge.riskView,
  }
}

export type BridgesRiskEntry = Awaited<
  ReturnType<typeof getBridgeRiskEntries>
>[number]
