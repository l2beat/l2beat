import { Layer2, layer2s, Layer3 } from '@l2beat/config'
import {
  ActivityApiResponse,
  ImplementationChangeReportApiResponse,
  TvlApiCharts,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../../build/config'
import { formatNumber } from '../../../utils'
import { getTpsDaily } from '../../../utils/activity/getTpsDaily'
import { getTpsWeeklyChange } from '../../../utils/activity/getTpsWeeklyChange'
import { getTransactionCount } from '../../../utils/activity/getTransactionCount'
import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { getRiskValues } from '../../../utils/risks/values'
import { getTvlBreakdown } from '../../../utils/tvl/getTVLBreakdown'
import { unifyTokensResponse } from '../../../utils/tvl/getTvlStats'
import { getDetailedTvlWithChange } from '../../../utils/tvl/getTvlWithChange'
import { ProjectHeaderProps } from '../components/header/ProjectHeader'
import { getLinks } from './getLinks'

export function getProjectHeader(
  project: Layer2 | Layer3,
  config: Config,
  tvlApiResponse: TvlApiResponse,
  implementationChange?: ImplementationChangeReportApiResponse | undefined,
  activityApiResponse?: ActivityApiResponse,
): ProjectHeaderProps {
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  const implementationChangeForProject =
    implementationChange?.projects[project.id.toString()]
  const implementationHasChanged =
    implementationChangeForProject !== undefined &&
    Object.values(implementationChangeForProject).length > 0

  const getDetailed = (chart: TvlApiCharts | undefined) => {
    const { parts, partsWeeklyChange } = getDetailedTvlWithChange(chart)
    return {
      tvl: parts.tvl,
      tvlWeeklyChange: partsWeeklyChange.tvl,
      canonical: parts.canonical,
      external: parts.external,
      native: parts.native,
    }
  }

  const { tvl, tvlWeeklyChange, canonical, external, native } = getDetailed(
    apiProject?.charts,
  )

  const activityData =
    activityApiResponse?.projects[project.id.toString()]?.daily.data
  const tpsDaily = activityData
    ? getTpsDaily(activityData, 'project')
    : undefined
  const tpsWeeklyChange = activityData
    ? getTpsWeeklyChange(activityData, 'project')
    : undefined
  const transactionMonthlyCount = activityData
    ? getTransactionCount(activityData, 'project', 30)
    : undefined

  const tvlBreakdown = getTvlBreakdown(
    project.display.name,
    project.config.associatedTokens ?? [],
    tvl,
    unifyTokensResponse(apiProject?.tokens),
  )

  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    description: project.display.description,
    tvlStats: {
      tvlChange: tvlWeeklyChange,
      tvl: project.config.escrows.length > 0 ? tvl : 0,
      canonical,
      external,
      native,
    },
    tpsDaily: tpsDaily?.toFixed(2) ?? '',
    tpsWeeklyChange,
    tvlWarning:
      project.type === 'layer2' ? project.display.tvlWarning : undefined,
    transactionMonthlyCount:
      transactionMonthlyCount !== undefined
        ? formatNumber(transactionMonthlyCount)
        : undefined,
    purposes: project.display.purposes,
    technology: project.display.category,
    tvlBreakdown: project.config.escrows.length > 0 ? tvlBreakdown : undefined,
    showTvlBreakdown: config.features.tvlBreakdown,
    tvlBreakdownHref: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
    links: getLinks(project.display.links),
    stage:
      project.type === 'layer2' ? project.stage : { stage: 'NotApplicable' },
    risks: getRiskValues(project.riskView),
    isArchived: project.type === 'layer2' && project.isArchived,
    isUpcoming: project.isUpcoming,
    isRiskRosetteUnderReview: project.isUnderReview,
    isImplementationUnderReview: implementationHasChanged,
    isUnderReview: isAnySectionUnderReview(project),
    warning: project.display.headerWarning,
    hostChain:
      project.type === 'layer3'
        ? project.hostChain === 'Multiple'
          ? 'Multiple'
          : layer2s.find((l) => l.id === project.hostChain)?.display.name
        : undefined,
  }
}
