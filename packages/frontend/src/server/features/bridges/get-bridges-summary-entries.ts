import {
  type BridgeDisplay,
  type ScalingProjectRiskViewEntry,
  type WarningWithSentiment,
  bridges,
} from '@l2beat/config'
import { compact } from 'lodash'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../projects-change-report/get-projects-change-report'
import { compareTvl } from '../scaling/tvl/utils/compare-tvl'
import {
  type LatestTvl,
  get7dTokenBreakdown,
} from '../scaling/tvl/utils/get-7d-token-breakdown'
import { getAssociatedTokenWarning } from '../scaling/tvl/utils/get-associated-token-warning'
import {
  type CommonBridgesEntry,
  getCommonBridgesEntry,
} from './get-common-bridges-entry'

export async function getBridgesSummaryEntries() {
  const [tvl7dBreakdown, projectsChangeReport] = await Promise.all([
    get7dTokenBreakdown({ type: 'bridge' }),
    getProjectsChangeReport(),
  ])

  return getBridges({
    tvl7dBreakdown,
    projectsChangeReport,
  })
}

interface TvlData {
  breakdown:
    | {
        total: number
        ether: number
        stablecoin: number
        associated: number
      }
    | undefined
  change: number | undefined
  associatedTokens: string[]
  associatedTokenWarning: WarningWithSentiment | undefined
  warnings: WarningWithSentiment[]
}

export interface BridgesSummaryEntry extends CommonBridgesEntry {
  type: BridgeDisplay['category']
  tvl: TvlData
  tvlOrder: number
  validatedBy: ScalingProjectRiskViewEntry
}

interface Params {
  tvl7dBreakdown: LatestTvl
  projectsChangeReport: ProjectsChangeReport
}

function getBridges(params: Params) {
  const { tvl7dBreakdown, projectsChangeReport } = params
  const activeBridges = bridges.filter(
    (bridge) => !bridge.isArchived && !bridge.isUpcoming,
  )
  const entries = activeBridges.map((bridge): BridgesSummaryEntry => {
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

    const changes = projectsChangeReport.getChanges(bridge.id)
    return {
      ...getCommonBridgesEntry({ bridge, changes }),
      type: bridge.display.category,
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
