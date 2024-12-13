import {
  type BridgeDisplay,
  type BridgeRiskView,
  bridges,
} from '@l2beat/config'
import { getProjectsChangeReport } from '../projects-change-report/get-projects-change-report'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import { get7dTokenBreakdown } from '../scaling/tvl/utils/get-7d-token-breakdown'
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
  const [tvl7dBreakdown, projectsChangeReport] = await Promise.all([
    get7dTokenBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
  ])

  return bridges
    .filter((bridge) => bridge.isArchived)
    .map((bridge) => {
      const tvl = tvl7dBreakdown.projects[bridge.id.toString()]
      const changes = projectsChangeReport.getChanges(bridge.id)
      return {
        ...getCommonBridgesEntry({ bridge, changes }),
        type: bridge.display.category,
        validatedBy: bridge.riskView?.validatedBy,
        totalTvl: tvl?.breakdown.total,
        tvlOrder: tvl?.breakdown.total ?? 0,
      }
    })
    .sort(compareTvl)
}
