import { Layer2, Layer3, layer2s } from '@l2beat/config'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { getRiskValues } from '../../../../utils/risks/values'
import { getTvlWarnings } from '../../../../utils/tvl/getTVLWarnings'
import { getTvlStats } from '../../../../utils/tvl/getTvlStats'
import { getTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { formatPercent, formatUSD } from '../../../../utils/utils'
import { getProjectTvlTooltipText } from '../../../project/common/getProjectTvlTooltipText'
import { isAnySectionUnderReview } from '../../../project/common/isAnySectionUnderReview'
import {
  ScalingL2SummaryViewEntry,
  ScalingL3SummaryViewEntry,
  SummaryPagesData,
} from '../types'
import { ScalingSummaryViewProps } from '../view/ScalingSummaryView'

export function getScalingSummaryView(
  projects: (Layer2 | Layer3)[],
  pagesData: SummaryPagesData,
  { layer3sTvl }: { layer3sTvl: boolean },
): ScalingSummaryViewProps {
  const ordered = orderByTvl(projects, pagesData.tvlApiResponse)

  const layer2s = ordered.filter((p) => p.type === 'layer2') as Layer2[]
  const layer3s = ordered.filter((p) => p.type === 'layer3') as Layer3[]

  return {
    layer2s: layer2s.map((project) =>
      getScalingL2SummaryEntry(project, pagesData),
    ),
    layer3s: layer3s.map((project) =>
      getScalingL3SummaryEntry(project, pagesData, { layer3sTvl }),
    ),
    layer3sTvl,
  }
}

function getScalingL2SummaryEntry(
  project: Layer2,
  pagesData: SummaryPagesData,
): ScalingL2SummaryViewEntry {
  const {
    tvlApiResponse,
    excludedTokensTvlApiResponse,
    verificationStatus,
    implementationChange,
  } = pagesData

  const isVerified = verificationStatus.projects[project.id.toString()]
  const hasImplementationChanged =
    !!implementationChange?.projects[project.id.toString()]

  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  const excludedApiProject =
    excludedTokensTvlApiResponse.projects[project.id.toString()]

  const { tvl: aggregateTvl } = getTvlWithChange(tvlApiResponse.layers2s)

  const stats = apiProject
    ? getTvlStats(apiProject, project.display.name, associatedTokens)
    : undefined
  const excludedTokensApiProject = excludedApiProject
    ? getTvlStats(excludedApiProject, project.display.name, associatedTokens)
    : undefined

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    provider: project.display.provider,
    category: project.display.category,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    hasImplementationChanged,
    isVerified,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    redWarning: project.display.redWarning,
    data:
      stats && escrowsConfigured(project)
        ? {
            tvl: {
              value: stats.latestTvl,
              displayValue: formatUSD(stats.latestTvl),
            },
            tvlBreakdown: stats.tvlBreakdown,
            oneDayChange: stats.oneDayChange,
            sevenDayChange: stats.sevenDayChange,
            tvlWarnings: getTvlWarnings(apiProject, associatedTokens, project),
            marketShare: {
              value: stats.latestTvl / aggregateTvl,
              displayValue: formatPercent(stats.latestTvl / aggregateTvl),
            },
            excludedTokens: excludedTokensApiProject
              ? {
                  tvl: {
                    value: excludedTokensApiProject.latestTvl,
                    displayValue: formatUSD(excludedTokensApiProject.latestTvl),
                  },
                  tvlBreakdown: excludedTokensApiProject.tvlBreakdown,
                  oneDayChange: excludedTokensApiProject.oneDayChange,
                  sevenDayChange: excludedTokensApiProject.sevenDayChange,
                  tvlWarnings: getTvlWarnings(
                    excludedApiProject,
                    associatedTokens,
                    project,
                  ),
                  marketShare: {
                    value: 10,
                    displayValue: '100%',
                  },
                }
              : undefined,
          }
        : undefined,
    tvlTooltip: getProjectTvlTooltipText(
      project.config,
      project.chainConfig?.chainId,
    ),
    purposes: project.display.purposes,
    stage: project.stage,
  }
}

function getScalingL3SummaryEntry(
  project: Layer3,
  pagesData: SummaryPagesData,
  { layer3sTvl }: { layer3sTvl: boolean },
): ScalingL3SummaryViewEntry {
  const {
    tvlApiResponse,
    excludedTokensTvlApiResponse,
    verificationStatus,
    implementationChange,
  } = pagesData
  const hasImplementationChanged =
    !!implementationChange?.projects[project.id.toString()]
  const isVerified = verificationStatus.projects[project.id.toString()]
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  const excludedTokensApiProject =
    excludedTokensTvlApiResponse.projects[project.id.toString()]

  const associatedTokens = project.config.associatedTokens ?? []
  const stats = apiProject
    ? getTvlStats(apiProject, project.display.name, associatedTokens)
    : undefined

  const excludedTokensStats = excludedTokensApiProject
    ? getTvlStats(
        excludedTokensApiProject,
        project.display.name,
        associatedTokens,
      )
    : undefined

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    provider: project.display.provider,
    category: project.display.category,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    hasImplementationChanged,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    purposes: project.display.purposes,
    hostChainName:
      project.hostChain === 'Multiple'
        ? 'Multiple'
        : layer2s.find((l) => l.id === project.hostChain)?.display.name,
    data:
      layer3sTvl && stats && escrowsConfigured(project)
        ? {
            tvl: {
              value: stats.latestTvl,
              displayValue: formatUSD(stats.latestTvl),
            },
            tvlBreakdown: stats.tvlBreakdown,
            oneDayChange: stats.oneDayChange,
            sevenDayChange: stats.sevenDayChange,
            tvlWarnings: getTvlWarnings(apiProject, associatedTokens, project),
            excludedTokens: excludedTokensStats
              ? {
                  tvl: {
                    value: excludedTokensStats.latestTvl,
                    displayValue: formatUSD(excludedTokensStats.latestTvl),
                  },
                  tvlBreakdown: excludedTokensStats.tvlBreakdown,
                  oneDayChange: excludedTokensStats.oneDayChange,
                  sevenDayChange: excludedTokensStats.sevenDayChange,
                  tvlWarnings: getTvlWarnings(
                    excludedTokensApiProject,
                    associatedTokens,
                    project,
                  ),
                }
              : undefined,
          }
        : undefined,
    tvlTooltip: getProjectTvlTooltipText(project.config),
  }
}

export function escrowsConfigured(project: Layer2 | Layer3) {
  return project.config.escrows.length > 0
}
