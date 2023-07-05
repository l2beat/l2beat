import { Bridge, Layer2 } from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared-pure'

import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { getTvlStats, TvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import { BridgesTvlViewEntry } from '../types'

export function getBridgesTvlView(
  projects: (Bridge | Layer2)[],
  tvlApiResponse: TvlApiResponse,
  bridgesTvl: number,
  combinedTvl: number,
  verificationStatus: VerificationStatus,
): BridgesTvlViewEntry[] {
  return projects.map((project) =>
    getBridgesTvlViewEntry(
      project,
      tvlApiResponse,
      bridgesTvl,
      combinedTvl,
      verificationStatus,
    ),
  )
}

function getBridgesTvlViewEntry(
  project: Bridge | Layer2,
  tvlApiResponse: TvlApiResponse,
  bridgesTvl: number,
  combinedTvl: number,
  verificationStatus: VerificationStatus,
): BridgesTvlViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  let stats: TvlStats | undefined

  if (!apiProject) {
    if (!project.isUpcoming) {
      throw new Error(`Project ${project.display.name} is missing in api`)
    }
  } else {
    stats = getTvlStats(apiProject, project.display.name, associatedTokens)
  }
  const isVerified = verificationStatus.projects[project.id.toString()]

  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    warning: project.display.warning,
    isArchived: project.isArchived,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    tvl: stats ? formatUSD(stats.tvl) : undefined,
    tvlBreakdown: stats ? stats.tvlBreakdown : undefined,
    oneDayChange: stats ? stats.oneDayChange : undefined,
    sevenDayChange: stats ? stats.sevenDayChange : undefined,
    bridgesMarketShare: stats
      ? formatPercent(stats.tvl / bridgesTvl)
      : undefined,
    combinedMarketShare: stats
      ? formatPercent(stats.tvl / combinedTvl)
      : undefined,
    validatedBy: project.riskView?.validatedBy,
    category: project.display.category,
  }
}
