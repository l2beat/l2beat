import { Bridge } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/types'

import { getTvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import { BridgesTvlViewEntry } from '../BridgesTvlView'

export function getBridgesTvlView(
  projects: Bridge[],
  tvlApiResponse: TvlApiResponse,
  tvl: number,
): BridgesTvlViewEntry[] {
  return projects.map((x) => getBridgesTvlViewEntry(x, tvlApiResponse, tvl))
}

function getBridgesTvlViewEntry(
  project: Bridge,
  tvlApiResponse: TvlApiResponse,
  aggregateTvl: number,
): BridgesTvlViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  if (!apiProject) {
    throw new Error(`Project ${project.display.name} is missing in api`)
  }
  const stats = getTvlStats(apiProject, project.display.name, associatedTokens)

  return {
    name: project.display.name,
    slug: project.display.slug,
    tvl: formatUSD(stats.tvl),
    tvlBreakdown: stats.tvlBreakdown,
    oneDayChange: stats.oneDayChange,
    sevenDayChange: stats.sevenDayChange,
    marketShare: formatPercent(stats.tvl / aggregateTvl),
    type: project.technology.type,
  }
}
