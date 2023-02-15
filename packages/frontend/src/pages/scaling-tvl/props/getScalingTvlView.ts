import { Layer2 } from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared'

import { Config } from '../../../build/config'
import { getTvlStats } from '../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../utils/utils'
import {
  ScalingTvlViewEntry,
  ScalingTvlViewProps,
} from '../view/ScalingTvlView'

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
    ratingEnabled: config.features.rating,
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
  if (!apiProject) {
    throw new Error(`Project ${project.display.name} is missing in api`)
  }
  const stats = getTvlStats(apiProject, project.display.name, associatedTokens)

  project.riskView.stateValidation.sentiment
  const summary = [
    getValue(project.riskView.stateValidation.sentiment),
    getValue(project.riskView.dataAvailability.sentiment),
    getValue(project.riskView.upgradeability.sentiment),
    getValue(project.riskView.sequencerFailure.sentiment),
    getValue(project.riskView.validatorFailure.sentiment),
  ]

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.technology.provider,
    warning: project.display.warning,
    isVerified,
    tvl: formatUSD(stats.tvl),
    tvlBreakdown: stats.tvlBreakdown,
    oneDayChange: stats.oneDayChange,
    sevenDayChange: stats.sevenDayChange,
    marketShare: formatPercent(stats.tvl / aggregateTvl),
    purpose: project.display.purpose,
    technology: project.technology.category,
    ratingEntry: project.rating,
    summary
  }
}

function getValue(sentiment: undefined | "warning" | "bad") {
  switch (sentiment) {
    case undefined:
      return 2
    case "warning":
      return 1
    case "bad":
      return 0
  }
} 
