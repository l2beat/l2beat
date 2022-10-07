import { Layer2 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/types'

import { getTvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import {
  ScalingTvlViewEntry,
  ScalingTvlViewProps,
} from '../view/ScalingTvlView'

export function getScalingTvlView(
  projects: Layer2[],
  tvlApiResponse: TvlApiResponse,
  tvl: number,
): ScalingTvlViewProps {
  return {
    items: projects.map((x) => getScalingTvlViewEntry(x, tvlApiResponse, tvl)),
  }
}

function getScalingTvlViewEntry(
  project: Layer2,
  tvlApiResponse: TvlApiResponse,
  aggregateTvl: number,
): ScalingTvlViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  if (!apiProject) {
    throw new Error(`Project ${project.display.name} is missing in api`)
  }
  const stats = getTvlStats(apiProject, project.display.name, associatedTokens)

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    warning: project.display.warning,
    tvl: formatUSD(stats.tvl),
    tvlBreakdown: stats.tvlBreakdown,
    oneDayChange: stats.oneDayChange,
    sevenDayChange: stats.sevenDayChange,
    marketShare: formatPercent(stats.tvl / aggregateTvl),
    purpose: project.display.purpose,
    technology: project.technology.category,
  }
}
