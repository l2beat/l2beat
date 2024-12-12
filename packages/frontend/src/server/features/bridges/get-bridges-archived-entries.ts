import {
  type BridgeDisplay,
  type BridgeRiskView,
  bridges,
} from '@l2beat/config'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import { get7dTokenBreakdown } from '../scaling/tvl/utils/get-7d-token-breakdown'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import {
  type CommonBridgesEntry,
  getCommonBridgesEntry,
} from './get-common-bridges-entry'

export interface BridgesArchivedEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  validatedBy: BridgeRiskView['validatedBy']
  totalTvl: number | undefined
  tvlOrder: number
}

export async function getBridgesArchivedEntries(): Promise<
  BridgesArchivedEntry[]
> {
  const archivedBridges = bridges.filter((bridge) => bridge.isArchived)
  const [tvl7dBreakdown, projectsChangeReport] = await Promise.all([
    get7dTokenBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
  ])

  const entries = archivedBridges.map((bridge) => {
    const tvl = tvl7dBreakdown.projects[bridge.id.toString()]
    const isVerified = getProjectsVerificationStatuses(bridge)
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

      validatedBy: bridge.riskView?.validatedBy,
      totalTvl: tvl?.breakdown.total,
      tvlOrder: tvl?.breakdown.total ?? 0,
    }
  })
  return entries.sort(compareTvl)
}
