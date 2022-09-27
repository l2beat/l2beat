import { Bridge } from '@l2beat/config'
import { ApiMain } from '@l2beat/types'

import { getTvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import { BridgesTvlViewEntry } from '../BridgesTvlView'

export function getBridgesTvlView(
  projects: Bridge[],
  apiMain: ApiMain,
  tvl: number,
): BridgesTvlViewEntry[] {
  return projects.map((x) => getBridgesTvlViewEntry(x, apiMain, tvl))
}

function getBridgesTvlViewEntry(
  project: Bridge,
  apiMain: ApiMain,
  aggregateTvl: number,
): BridgesTvlViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = apiMain.projects[project.id.toString()]
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
