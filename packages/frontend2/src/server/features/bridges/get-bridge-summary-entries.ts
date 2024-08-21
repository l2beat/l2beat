import { type Bridge, bridges } from '@l2beat/config'
import {
  type ImplementationChangeReportApiResponse,
  type ProjectId,
  type ProjectsVerificationStatuses,
} from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getLatestTvlUsd } from '../scaling/tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../scaling/tvl/utils/order-by-tvl'
import { isAnySectionUnderReview } from '../scaling/utils/is-any-section-under-review'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getDestination } from './get-destination'

export async function getBridgesSummaryEntries() {
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

function getBridges(params: Params) {
  const {
    projects,
    tvl,
    implementationChangeReport,
    projectsVerificationStatuses,
  } = params
  const entries = projects.map((bridge) => {
    // getLatestTvl is mostly likely cached at this point
    const bridgesOnlyTotal = Object.entries(tvl).reduce(
      (acc, [projectId, value]) => {
        const isBridge = bridges.find((bridge) => bridge.id === projectId)

        const valueToAdd = isBridge ? value : 0

        return acc + valueToAdd
      },
      0,
    )

    const bridgeTvl = tvl[bridge.id]

    const isVerified = !!projectsVerificationStatuses[bridge.id.toString()]
    const hasImplementationChanged =
      !!implementationChangeReport.projects[bridge.id.toString()]

    return {
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
      tvl: bridgeTvl,
      bridgesMarketShare: bridgeTvl ? bridgeTvl / bridgesOnlyTotal : undefined,
      validatedBy: bridge.riskView?.validatedBy,
      category: bridge.display.category,
      warning: bridge.display.warning,
    }
  })

  return entries
}

export type BridgesSummaryEntry = Awaited<
  ReturnType<typeof getBridgesSummaryEntries>
>[number]
