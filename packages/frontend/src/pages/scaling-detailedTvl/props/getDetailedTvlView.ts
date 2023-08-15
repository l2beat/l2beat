import { Layer2 } from '@l2beat/config'
import {
  assert,
  DetailedTvlApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../../build/config'
import { isAnySectionUnderReview } from '../../../utils/project/isAnySectionUnderReview'
import { getRiskValues } from '../../../utils/risks/values'
import { getDetailedTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'
import { DetailedTvlViewEntry } from '../types'
import { DetailedTvlViewProps } from '../view/DetailedTvlView'

export function getDetailedTvlView(
  tvlApiResponse: DetailedTvlApiResponse | TvlApiResponse,
  config: Config,
  projects: Layer2[],
): DetailedTvlViewProps {
  return {
    items: projects.map((project) =>
      getDetailedTvlViewEntry(
        tvlApiResponse as DetailedTvlApiResponse,
        project,
      ),
    ),
    upcomingEnabled: config.features.upcomingRollups,
  }
}

function getDetailedTvlViewEntry(
  tvlApiResponse: DetailedTvlApiResponse,
  project: Layer2,
  isVerified?: boolean,
): DetailedTvlViewEntry {
  assert(
    tvlApiResponse.projects[project.id.toString()]?.charts.hourly.types
      .length === 9,
  )
  const charts =
    tvlApiResponse.projects[project.id.toString()]?.charts ?? undefined
  const { parts, partsWeeklyChange } = getDetailedTvlWithChange(charts)

  return {
    name: project.display.name,
    slug: project.display.slug,
    provider: project.display.provider,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isUpcoming: project.isUpcoming,
    isVerified,
    tvl: formatUSD(parts.tvl),
    cbv: formatUSD(parts.cbv),
    ebv: formatUSD(parts.ebv),
    nmv: formatUSD(parts.nmv),
    tvlChange: partsWeeklyChange.tvl,
    ebvChange: partsWeeklyChange.ebv,
    cbvChange: partsWeeklyChange.cbv,
    nmvChange: partsWeeklyChange.nmv,
  }
}
