import { Bridge, Layer2 } from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared'

import { getTvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import { BridgesTvlViewEntry } from '../BridgesTvlView'

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
  if (!apiProject) {
    throw new Error(`Project ${project.display.name} is missing in api`)
  }
  const stats = getTvlStats(apiProject, project.display.name, associatedTokens)
  const isVerified = verificationStatus.projects[project.id.toString()]

  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    warning: project.display.warning,
    isVerified,
    tvl: formatUSD(stats.tvl),
    tvlBreakdown: stats.tvlBreakdown,
    oneDayChange: stats.oneDayChange,
    sevenDayChange: stats.sevenDayChange,
    bridgesMarketShare: formatPercent(stats.tvl / bridgesTvl),
    combinedMarketShare: formatPercent(stats.tvl / combinedTvl),
    validatedBy: project.riskView?.validatedBy,
    category: project.technology.category,
  }
}
