import { bridges } from '@l2beat/config'
import { type ProjectsVerificationStatuses } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../scaling/tvl/utils/get-7d-token-breakdown'
import { getAssociatedTokenWarning } from '../scaling/tvl/utils/get-associated-token-warning'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getCommonBridgesEntry } from './get-common-bridges-entry'
import { getDestination } from './get-destination'

export async function getBridgesSummaryEntries() {
  const [tvl7dBreakdown, projectsChangeReport, projectsVerificationStatuses] =
    await Promise.all([
      get7dTokenBreakdown({ type: 'bridge' }),
      getProjectsChangeReport(),
      getProjectsVerificationStatuses(),
    ])

  return getBridges({
    tvl7dBreakdown,
    projectsChangeReport,
    projectsVerificationStatuses,
  })
}

interface Params {
  tvl7dBreakdown: LatestTvl
  projectsChangeReport: ProjectsChangeReport
  projectsVerificationStatuses: ProjectsVerificationStatuses
}

function getBridges(params: Params) {
  const { tvl7dBreakdown, projectsChangeReport, projectsVerificationStatuses } =
    params
  const activeBridges = bridges.filter(
    (bridge) => !bridge.isArchived && !bridge.isUpcoming,
  )
  const entries = activeBridges.map((bridge) => {
    const bridgeTvl = tvl7dBreakdown.projects[bridge.id.toString()]

    const associatedTokenWarning =
      bridgeTvl && bridgeTvl.breakdown.total > 0
        ? getAssociatedTokenWarning({
            associatedRatio:
              bridgeTvl.breakdown.associated / bridgeTvl.breakdown.total,
            name: bridge.display.name,
            associatedTokens: bridge.config.associatedTokens ?? [],
          })
        : undefined

    const isVerified = !!projectsVerificationStatuses[bridge.id.toString()]
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
      isUpcoming: bridge.isUpcoming,
      destination: getDestination(
        bridge.type === 'bridge'
          ? bridge.technology.destination
          : [bridge.display.name],
      ),
      tvl: {
        breakdown: bridgeTvl?.breakdown,
        change: bridgeTvl?.change,
        associatedTokens: bridge.config.associatedTokens ?? [],
        associatedTokenWarning,
        warnings: compact([
          associatedTokenWarning?.sentiment === 'bad' && associatedTokenWarning,
        ]),
      },
      tvlOrder: bridgeTvl?.breakdown.total ?? 0,
      validatedBy: bridge.riskView.validatedBy,
    }
  })
  return entries.sort(compareTvl)
}

export type BridgesSummaryEntry = Awaited<
  ReturnType<typeof getBridgesSummaryEntries>
>[number]
