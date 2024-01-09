import { Layer2 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/shared-pure'

import { getIncludedProjects } from '../../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { getTokens } from '../../../../utils/project/getChart'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { getRiskValues } from '../../../../utils/risks/values'
import { getDetailedTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { formatUSD } from '../../../../utils/utils'
import { ScalingTvlViewEntry } from '../types'
import { ScalingTvlViewProps } from '../view/ScalingTvlView'

export function getScalingTvlView(
  projects: Layer2[],
  tvlApiResponse: TvlApiResponse,
): ScalingTvlViewProps {
  const included = getIncludedProjects(projects, tvlApiResponse)
  const orderedProjects = orderByTvl(included, tvlApiResponse)

  return {
    items: orderedProjects.map((project) =>
      getScalingTvlViewEntry(tvlApiResponse, project),
    ),
  }
}

function getScalingTvlViewEntry(
  tvlApiResponse: TvlApiResponse,
  project: Layer2,
  isVerified?: boolean,
): ScalingTvlViewEntry {
  const projectData = tvlApiResponse.projects[project.id.toString()]
  const charts = projectData?.charts
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
    tvl: {
      value: parts.tvl,
      displayValue: formatUSD(parts.tvl),
    },
    cbv: {
      value: parts.canonical,
      displayValue: formatUSD(parts.canonical),
    },
    ebv: {
      value: parts.external,
      displayValue: formatUSD(parts.external),
    },
    nmv: {
      value: parts.native,
      displayValue: formatUSD(parts.native),
    },
    tvlChange: partsWeeklyChange.tvl,
    ebvChange: partsWeeklyChange.external,
    cbvChange: partsWeeklyChange.canonical,
    nmvChange: partsWeeklyChange.native,
    tokens: getTokens(project.id, tvlApiResponse, true),
    stage: project.stage,
  }
}
