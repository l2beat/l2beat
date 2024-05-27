import { Layer2, Layer3, layer2s } from '@l2beat/config'
import {
  ImplementationChangeReportApiResponse,
  TvlApiResponse,
  VerificationStatus,
} from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { getRiskValues } from '../../../../utils/risks/values'
import { formatPercent, formatUSD } from '../../../../utils/utils'
import { getProjectTvlTooltipText } from '../../../project/common/getProjectTvlTooltipText'
import { isAnySectionUnderReview } from '../../../project/common/isAnySectionUnderReview'
import { ScalingL2SummaryViewEntry, ScalingL3SummaryViewEntry } from '../types'
import { getTvlWarnings } from '../../../../utils/tvl/getTVLWarnings'
import { TvlStats, getTvlStats } from '../../../../utils/tvl/getTvlStats'
import { ScalingSummaryViewProps } from '../view/ScalingSummaryView'

export function getScalingSummaryView(
  projects: (Layer2 | Layer3)[],
  tvlApiResponse: TvlApiResponse,
  tvl: number,
  verificationStatus: VerificationStatus,
  implementationChange: ImplementationChangeReportApiResponse | undefined,
  { layer3sTvl }: { layer3sTvl: boolean },
): ScalingSummaryViewProps {
  const ordered = orderByTvl(projects, tvlApiResponse)

  const layer2s = ordered.filter((p) => p.type === 'layer2') as Layer2[]
  const layer3s = ordered.filter((p) => p.type === 'layer3') as Layer3[]

  return {
    layer2s: layer2s.map((project) => {
      const hasImplementationChanged =
        !!implementationChange?.projects[project.id.toString()]
      return getScalingL2SummaryEntry(
        project,
        tvlApiResponse,
        tvl,
        verificationStatus.projects[project.id.toString()],
        hasImplementationChanged,
      )
    }),
    layer3s: layer3s.map((project) => {
      const hasImplementationChanged =
        !!implementationChange?.projects[project.id.toString()]
      return getScalingL3SummaryEntry(
        project,
        tvlApiResponse,
        verificationStatus.projects[project.id.toString()],
        hasImplementationChanged,
        { layer3sTvl },
      )
    }),
    layer3sTvl,
  }
}

function getScalingL2SummaryEntry(
  project: Layer2,
  tvlApiResponse: TvlApiResponse,
  aggregateTvl: number,
  isVerified?: boolean,
  hasImplementationChanged?: boolean,
): ScalingL2SummaryViewEntry {
  const associatedTokens = project.config.associatedTokens ?? []
  const apiProject = tvlApiResponse.projects[project.id.toString()]

  let stats: TvlStats | undefined

  if (apiProject) {
    stats = getTvlStats(apiProject, project.display.name, associatedTokens)
  }

  const tvlWarnings = getTvlWarnings(apiProject, associatedTokens, project)

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
    tvlWarnings,
    tvl:
      stats && escrowsConfigured(project)
        ? {
            value: stats.latestTvl,
            displayValue: formatUSD(stats.latestTvl),
          }
        : undefined,
    tvlTooltip: getProjectTvlTooltipText(
      project.config,
      project.chainConfig?.chainId,
    ),
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
    purposes: project.display.purposes,
    stage: project.stage,
  }
}

function getScalingL3SummaryEntry(
  project: Layer3,
  tvlApiResponse: TvlApiResponse,
  isVerified: boolean | undefined,
  hasImplementationChanged: boolean | undefined,
  { layer3sTvl }: { layer3sTvl: boolean },
): ScalingL3SummaryViewEntry {
  const apiProject = tvlApiResponse.projects[project.id.toString()]

  let stats: TvlStats | undefined

  if (apiProject) {
    stats = getTvlStats(
      apiProject,
      project.display.name,
      project.config.associatedTokens ?? [],
    )
  }
  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    provider: project.display.provider,
    category: project.display.category,
    warning: project.display.warning,
    hasImplementationChanged,
    isVerified,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    purposes: project.display.purposes,
    hostChainName:
      project.hostChain === 'Multiple'
        ? 'Multiple'
        : layer2s.find((l) => l.id === project.hostChain)?.display.name,
    tvl:
      layer3sTvl && stats && escrowsConfigured(project)
        ? {
            value: stats.latestTvl,
            displayValue: formatUSD(stats.latestTvl),
          }
        : undefined,
    tvlTooltip: getProjectTvlTooltipText(project.config),
    tvlBreakdown: layer3sTvl ? stats?.tvlBreakdown : undefined,
    sevenDayChange:
      layer3sTvl && stats && escrowsConfigured(project)
        ? stats.sevenDayChange
        : undefined,
    oneDayChange:
      layer3sTvl && stats && escrowsConfigured(project)
        ? stats.oneDayChange
        : undefined,
  }
}

export function escrowsConfigured(project: Layer2 | Layer3) {
  return project.config.escrows.length > 0
}
