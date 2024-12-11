import { bridges } from '@l2beat/config'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { get7dTokenBreakdown } from '../scaling/tvl/utils/get-7d-token-breakdown'
import { orderByTvl } from '../scaling/tvl/utils/order-by-tvl'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getCommonBridgesEntry } from './get-common-bridges-entry'

export type BridgesArchivedEntry = Awaited<
  ReturnType<typeof getBridgesArchivedEntries>
>[number]
export async function getBridgesArchivedEntries() {
  const archivedBridges = bridges.filter((bridge) => bridge.isArchived)
  const [tvl7dBreakdown, projectsChangeReport, projectsVerificationStatuses] =
    await Promise.all([
      get7dTokenBreakdown({ type: 'bridge' }),
      getProjectsChangeReport(),
      getProjectsVerificationStatuses(),
    ])

  const entries = archivedBridges.map((bridge) => {
    const tvl = tvl7dBreakdown.projects[bridge.id.toString()]
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
      validatedBy: bridge.riskView?.validatedBy,
      totalTvl: tvl?.breakdown.total,
    }
  })

  const remappedForOrdering = Object.fromEntries(
    Object.entries(tvl7dBreakdown.projects).map(([k, v]) => [
      k,
      v.breakdown.total,
    ]),
  )

  return orderByTvl(entries, remappedForOrdering)
}
