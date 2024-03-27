import { Layer2 } from '@l2beat/config'
import {
  ImplementationChangeReportApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

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
  implementationChange: ImplementationChangeReportApiResponse | undefined,
): ScalingTvlViewProps {
  const orderedProjects = orderByTvl(projects, tvlApiResponse)

  return {
    items: orderedProjects.map((project) =>
      getScalingTvlViewEntry(
        tvlApiResponse,
        project,
        undefined,
        Object.prototype.hasOwnProperty.call(
          implementationChange?.projects,
          project.id.toString(),
        ),
      ),
    ),
  }
}

function getScalingTvlViewEntry(
  tvlApiResponse: TvlApiResponse,
  project: Layer2,
  isVerified?: boolean,
  hasImplementationChanged?: boolean,
): ScalingTvlViewEntry {
  const projectData = tvlApiResponse.projects[project.id.toString()]
  const charts = projectData?.charts
  const { parts, partsWeeklyChange } = getDetailedTvlWithChange(charts)

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
    hasImplementationChanged,
    riskValues: getRiskValues(project.riskView),
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    tvlWarning: project.display.tvlWarning,
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
