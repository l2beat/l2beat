import { type Bridge, bridges } from '@l2beat/config'
import { notUndefined } from '@l2beat/shared-pure'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import { getProjectsLatestTvlUsd } from '../scaling/tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../scaling/tvl/utils/order-by-tvl'
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

      return getBridgesRiskEntry(project, projectsChangeReport, isVerified)
    })
    .filter(notUndefined)

  return orderByTvl(entries, tvl)
}

function getBridgesRiskEntry(
  bridge: Bridge,
  projectsChangeReport: ProjectsChangeReport,
  isVerified: boolean,
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
    ...bridge.riskView,
  }
}

export type BridgesRiskEntry = Awaited<
  ReturnType<typeof getBridgeRiskEntries>
>[number]
