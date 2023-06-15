import { Layer2 } from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared-pure'

import { Config } from '../../../build/config'
import { getRiskValues } from '../../../utils/risks/values'
import { getTvlStats, TvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import { ScalingTvlViewEntry } from '../types'
import { ScalingTvlViewProps } from '../view/ScalingTvlView'

export function getScalingTvlView(
  config: Config,
  projects: Layer2[],
  tvlApiResponse: TvlApiResponse,
  tvl: number,
  verificationStatus: VerificationStatus,
): ScalingTvlViewProps {
  return {
    items: projects.map((project) =>
      getScalingTvlViewEntry(
        project,
        tvlApiResponse,
        tvl,
        verificationStatus.projects[project.id.toString()],
      ),
    ),
    stagesEnabled: config.features.stages,
    upcomingEnabled: config.features.upcomingRollups,
  }
}

function getScalingTvlViewEntry(
  project: Layer2,
  tvlApiResponse: TvlApiResponse,
  aggregateTvl: number,
  isVerified?: boolean,
): ScalingTvlViewEntry {
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

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    isVerified,
    isArchived: project.isArchived,
    isUpcoming: project.isUpcoming,
    tvl: stats ? formatUSD(stats.tvl) : undefined,
    tvlBreakdown: stats ? stats.tvlBreakdown : undefined,
    oneDayChange: stats ? stats.oneDayChange : undefined,
    sevenDayChange: stats ? stats.sevenDayChange : undefined,
    marketShare: stats ? formatPercent(stats.tvl / aggregateTvl) : undefined,
    purpose: project.display.purpose,
    technology: project.technology.category,
    stage: project.stage,
  }
}
