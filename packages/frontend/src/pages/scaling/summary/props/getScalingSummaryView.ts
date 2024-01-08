import { Layer2, layer2s, Layer3 } from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { getProjectTvlTooltipText } from '../../../../utils/project/getProjectTvlTooltipText'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { getRiskValues } from '../../../../utils/risks/values'
import { getTvlStats, TvlStats } from '../../../../utils/tvl/getTvlStats'
import { formatPercent, formatUSD } from '../../../../utils/utils'
import { ScalingL2SummaryViewEntry, ScalingL3SummaryViewEntry } from '../types'
import { ScalingSummaryViewProps } from '../view/ScalingSummaryView'

export function getScalingSummaryView(
  projects: (Layer2 | Layer3)[],
  tvlApiResponse: TvlApiResponse,
  tvl: number,
  verificationStatus: VerificationStatus,
): ScalingSummaryViewProps {
  const ordered = orderByTvl(projects, tvlApiResponse)

  const layer2s = ordered.filter((p) => p.type === 'layer2') as Layer2[]
  const layer3s = ordered.filter((p) => p.type === 'layer3') as Layer3[]

  return {
    layer2s: layer2s.map((project) =>
      getScalingL2SummaryEntry(
        project,
        tvlApiResponse,
        tvl,
        verificationStatus.projects[project.id.toString()],
      ),
    ),
    layer3s: layer3s.map((project) =>
      getScalingL3SummaryEntry(
        project,
        verificationStatus.projects[project.id.toString()],
      ),
    ),
  }
}

function getScalingL2SummaryEntry(
  project: Layer2,
  tvlApiResponse: TvlApiResponse,
  aggregateTvl: number,
  isVerified?: boolean,
): ScalingL2SummaryViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]

  let stats: TvlStats | undefined

  if (apiProject) {
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
    redWarning: project.display.redWarning,
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

function getScalingL3SummaryEntry(
  project: Layer3,
  isVerified?: boolean,
): ScalingL3SummaryViewEntry {
  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    provider: project.display.provider,
    category: project.display.category,
    warning: project.display.warning,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    purpose: project.display.purpose,
    hostChainName: layer2s.find((l) => l.id === project.hostChain)?.display
      .name,
  }
}

export function escrowsConfigured(project: Layer2) {
  return project.config.escrows.length > 0
}
