import { type Bridge, bridges } from '@l2beat/config'
import {
  type ImplementationChangeReportApiResponse,
  type ProjectsVerificationStatuses,
} from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { formatNumber } from '~/utils/format-number'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { type TvlResponse } from '../scaling/get-tvl'
import { getTvlStats } from '../scaling/utils/get-tvl-stats'
import { getTvlWithChange } from '../scaling/utils/get-tvl-with-change'
import { isAnySectionUnderReview } from '../scaling/utils/is-any-section-under-review'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getDestination } from './get-destination'
import { type BridgesSummaryEntry } from './types'

export async function getBridgesSummaryEntries(
  tvl: TvlResponse,
): Promise<BridgesSummaryEntry[]> {
  // NOTEtype : This is a temporary solution to keep the current behavior & will be removed in L2B-6115.
  const preprocessedTvl = Object.fromEntries(
    Object.entries(tvl.bridges).map(([projectId, data]) => [
      projectId,
      // ??? is this correct?
      data.data.at(-1)?.[1] ?? 0,
    ]),
  )

  const orderedBridges = orderByTvl(bridges, preprocessedTvl)

  const implementationChangeReport = await getImplementationChangeReport()
  const projectsVerificationStatuses = await getProjectsVerificationStatuses()

  return getBridges({
    projects: orderedBridges,
    tvl,
    implementationChangeReport,
    projectsVerificationStatuses,
  })
}

interface Params {
  projects: Bridge[]
  tvl: TvlResponse
  implementationChangeReport: ImplementationChangeReportApiResponse
  projectsVerificationStatuses: ProjectsVerificationStatuses
}

function getBridges(params: Params): BridgesSummaryEntry[] {
  const {
    projects,
    tvl,
    implementationChangeReport,
    projectsVerificationStatuses,
  } = params
  const entries = projects.map((bridge) => {
    const projectTvl = tvl.projects[bridge.id.toString()]

    const associatedTokens = bridge.config.associatedTokens ?? []
    const stats = projectTvl
      ? getTvlStats(projectTvl, bridge.display.name, associatedTokens)
      : undefined
    const { tvl: aggregateTvl } = getTvlWithChange(tvl.bridges)

    const isVerified = !!projectsVerificationStatuses[bridge.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[bridge.id.toString()]

    const entry: BridgesSummaryEntry = {
      href: `/bridges/${bridge.display.slug}`,
      type: bridge.type,
      shortName: bridge.display.shortName,
      name: bridge.display.name,
      slug: bridge.display.slug,
      isArchived: bridge.isArchived,
      isUpcoming: bridge.isUpcoming,
      isVerified,
      destination: getDestination(
        bridge.type === 'bridge'
          ? bridge.technology.destination
          : [bridge.display.name],
      ),
      hasImplementationChanged,
      showProjectUnderReview: isAnySectionUnderReview(bridge),
      tvl: stats
        ? {
            displayValue: formatUSD(stats.latestTvl),
            value: stats.latestTvl,
          }
        : undefined,
      tvlBreakdown: stats ? stats.tvlBreakdown : undefined,
      sevenDayChange: stats ? stats.sevenDayChange : undefined,
      bridgesMarketShare: stats ? stats.latestTvl / aggregateTvl : undefined,
      validatedBy: bridge.riskView?.validatedBy,
      category: bridge.display.category,
    }

    return entry
  })

  return compact(entries)
}

export function formatUSD(value: number) {
  return `$${formatNumber(value)}`
}
