import { Bridge, Layer2 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/types'

import { getTvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import { BridgesTvlViewEntry } from '../BridgesTvlView'

export function getBridgesTvlView(
  projects: (Bridge | Layer2)[],
  tvlApiResponse: TvlApiResponse,
  bridgesTvl: number,
  combinedTvl: number,
): BridgesTvlViewEntry[] {
  return projects.map((x) =>
    getBridgesTvlViewEntry(x, tvlApiResponse, bridgesTvl, combinedTvl),
  )
}

function getBridgesTvlViewEntry(
  project: Bridge | Layer2,
  tvlApiResponse: TvlApiResponse,
  bridgesTvl: number,
  combinedTvl: number,
): BridgesTvlViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  if (!apiProject) {
    throw new Error(`Project ${project.display.name} is missing in api`)
  }
  const stats = getTvlStats(apiProject, project.display.name, associatedTokens)

  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    tvl: formatUSD(stats.tvl),
    tvlBreakdown: stats.tvlBreakdown,
    oneDayChange: stats.oneDayChange,
    sevenDayChange: stats.sevenDayChange,
    bridgesMarketShare: formatPercent(stats.tvl / bridgesTvl),
    combinedMarketShare: formatPercent(stats.tvl / combinedTvl),
    category:
      project.type === 'bridge'
        ? project.technology.type
        : project.technology.category,
  }
}
