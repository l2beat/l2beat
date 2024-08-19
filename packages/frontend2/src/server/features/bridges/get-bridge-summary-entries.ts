import { type Bridge, bridges } from '@l2beat/config'
import {
  type ImplementationChangeReportApiResponse,
  type ProjectId,
  type ProjectsVerificationStatuses,
} from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { formatNumber } from '~/utils/format-number'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getLatestTvlUsd } from '../scaling/tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../scaling/tvl/utils/order-by-tvl'
import { isAnySectionUnderReview } from '../scaling/utils/is-any-section-under-review'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getDestination } from './get-destination'
import { type BridgesSummaryEntry } from './types'

export async function getBridgesSummaryEntries(): Promise<
  BridgesSummaryEntry[]
> {
  const [
    latestTvlUsd,
    implementationChangeReport,
    projectsVerificationStatuses,
  ] = await Promise.all([
    getLatestTvlUsd(),
    getImplementationChangeReport(),
    getProjectsVerificationStatuses(),
  ])

  const orderedBridges = orderByTvl(bridges, latestTvlUsd)

  return getBridges({
    projects: orderedBridges,
    tvl: latestTvlUsd,
    implementationChangeReport,
    projectsVerificationStatuses,
  })
}

interface Params {
  projects: Bridge[]
  tvl: Record<ProjectId, number>
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
    // Query for actual bridges
    const totalTvl = Object.values(tvl).reduce((acc, tvl) => acc + tvl, 0)
    const projectTvl = tvl[bridge.id]

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
      tvl: projectTvl,
      bridgesMarketShare: projectTvl ? projectTvl / totalTvl : undefined,
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
