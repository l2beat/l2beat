import { Bridge, Layer2 } from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { getTvlStats, TvlStats } from '../../../../utils/tvl/getTvlStats'
import { getTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { formatPercent, formatUSD } from '../../../../utils/utils'
import { BridgesPagesData } from '../../types'
import { BridgesSummaryViewEntry } from '../types'
import { BridgesSummaryViewProps } from '../view/BridgesSummaryView'

export function getBridgesSummaryView(
  projects: (Bridge | Layer2)[],
  pagesData: BridgesPagesData,
): BridgesSummaryViewProps {
  const { tvlApiResponse, verificationStatus } = pagesData

  const ordered = orderByTvl(projects, tvlApiResponse)

  const { tvl: bridgesTvl } = getTvlWithChange(tvlApiResponse.bridges)
  const { tvl: combinedTvl } = getTvlWithChange(tvlApiResponse.combined)

  return {
    items: ordered.map((project) =>
      getBridgesSummaryViewEntry(
        project,
        tvlApiResponse,
        bridgesTvl,
        combinedTvl,
        verificationStatus,
      ),
    ),
  }
}

export function getBridgesSummaryViewEntry(
  project: Bridge | Layer2,
  tvlApiResponse: TvlApiResponse,
  bridgesTvl: number,
  combinedTvl: number,
  verificationStatus: VerificationStatus,
): BridgesSummaryViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  let stats: TvlStats | undefined

  if (apiProject) {
    stats = getTvlStats(apiProject, project.display.name, associatedTokens)
  }
  const isVerified = verificationStatus.projects[project.id.toString()]

  return {
    type: project.type,
    shortName: project.display.shortName,
    name: project.display.name,
    slug: project.display.slug,
    warning: project.display.warning,
    isArchived: project.isArchived,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    tvl: stats
      ? {
          displayValue: formatUSD(stats.latestTvl),
          value: stats.latestTvl,
        }
      : undefined,
    tvlBreakdown: stats ? stats.tvlBreakdown : undefined,
    oneDayChange: stats ? stats.oneDayChange : undefined,
    sevenDayChange: stats ? stats.sevenDayChange : undefined,
    bridgesMarketShare: stats
      ? formatPercent(stats.latestTvl / bridgesTvl)
      : undefined,
    combinedMarketShare: stats
      ? {
          displayValue: formatPercent(stats.latestTvl / combinedTvl),
          value: stats.latestTvl / combinedTvl,
        }
      : undefined,
    validatedBy: project.riskView?.validatedBy,
    category: project.display.category,
  }
}
