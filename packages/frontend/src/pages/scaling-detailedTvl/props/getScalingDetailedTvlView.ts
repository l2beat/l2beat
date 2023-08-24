import { Layer2 } from '@l2beat/config'
import {
  assert,
  DetailedTvlApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../../build/config'
import { getTokens } from '../../../utils/project/getChart'
import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { getRiskValues } from '../../../utils/risks/values'
import { getDetailedTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'
import { ScalingDetailedTvlViewEntry } from '../types'
import { ScalingDetailedTvlViewProps } from '../view/ScalingDetailedTvlView'

export function getScalingDetailedTvlView(
  tvlApiResponse: DetailedTvlApiResponse | TvlApiResponse,
  config: Config,
  projects: Layer2[],
): ScalingDetailedTvlViewProps {
  return {
    items: projects.map((project) =>
      getScalingDetailedTvlViewEntry(
        tvlApiResponse as DetailedTvlApiResponse,
        project,
      ),
    ),
    upcomingEnabled: config.features.upcomingRollups,
  }
}

function getScalingDetailedTvlViewEntry(
  tvlApiResponse: DetailedTvlApiResponse,
  project: Layer2,
  isVerified?: boolean,
): ScalingDetailedTvlViewEntry {
  const projectData = tvlApiResponse.projects[project.id.toString()]
  assert(projectData?.charts.hourly.types.length === 9)
  const charts = projectData.charts
  const { parts, partsWeeklyChange } = getDetailedTvlWithChange(charts)

  return {
    name: project.display.name,
    slug: project.display.slug,
    category: project.display.category,
    provider: project.display.provider,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    isVerified,
    tvl: formatUSD(parts.tvl),
    cbv: formatUSD(parts.canonical),
    ebv: formatUSD(parts.external),
    nmv: formatUSD(parts.native),
    tvlChange: partsWeeklyChange.tvl,
    ebvChange: partsWeeklyChange.external,
    cbvChange: partsWeeklyChange.canonical,
    nmvChange: partsWeeklyChange.native,
    tokens: getTokens(project.id, tvlApiResponse, true),
  }
}
