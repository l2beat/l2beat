import { Layer2, layer2s } from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared-pure'

import { getIncludedProjects } from '../../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { getProjectTvlTooltipText } from '../../../../utils/project/getProjectTvlTooltipText'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { getRiskValues } from '../../../../utils/risks/values'
import { getTvlStats, TvlStats } from '../../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../../utils/utils'
import { ScalingSummaryViewEntry } from '../types'
import { ScalingSummaryViewProps } from '../view/ScalingSummaryView'

export function getScalingSummaryView(
  projects: Layer2[],
  tvlApiResponse: TvlApiResponse,
  tvl: number,
  verificationStatus: VerificationStatus,
): ScalingSummaryViewProps {
  const included = getIncludedProjects(projects, tvlApiResponse)
  const ordered = orderByTvl(included, tvlApiResponse)
  return {
    items: ordered.map((project) =>
      getScalingSummarySummaryEntry(
        project,
        tvlApiResponse,
        tvl,
        verificationStatus.projects[project.id.toString()],
      ),
    ),
  }
}

function getScalingSummarySummaryEntry(
  project: Layer2,
  tvlApiResponse: TvlApiResponse,
  aggregateTvl: number,
  isVerified?: boolean,
): ScalingSummaryViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]

  let stats: TvlStats | undefined

  if (!apiProject) {
    if (!project.isUpcoming && !project.isLayer3) {
      throw new Error(`Project ${project.display.name} is missing in api`)
    }
  } else {
    stats = getTvlStats(apiProject, project.display.name, associatedTokens)
  }

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    provider: project.display.provider,
    category: project.display.category,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    isVerified,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    isLayer3: project.isLayer3,
    redWarning: project.display.redWarning,
    hostChainName: layer2s.find((l) => l.id === project.hostChain)?.display
      .name,
    tvl:
      stats && escrowsConfigured(project)
        ? {
            value: stats.latestTvl,
            displayValue: formatUSD(stats.latestTvl),
          }
        : undefined,
    tvlTooltip: getProjectTvlTooltipText(project.config),
    tvlBreakdown:
      stats && escrowsConfigured(project) ? stats.tvlBreakdown : undefined,
    oneDayChange:
      stats && escrowsConfigured(project) ? stats.oneDayChange : undefined,
    sevenDayChange:
      stats && escrowsConfigured(project) ? stats.sevenDayChange : undefined,
    marketShare:
      stats && escrowsConfigured(project)
        ? {
            value: stats.latestTvl / aggregateTvl,
            displayValue: formatPercent(stats.latestTvl / aggregateTvl),
          }
        : undefined,
    marketShareValue: stats?.latestTvl && stats.latestTvl / aggregateTvl,
    purpose: project.display.purpose,
    stage: project.stage,
  }
}

export function escrowsConfigured(project: Layer2) {
  return project.config.escrows.length > 0
}
