import { Bridge } from '@l2beat/config'
import {
  ImplementationChangeReportApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { getDestination } from '../../../../utils/getDestination'
import { getTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { formatUSD } from '../../../../utils/utils'
import { getLinks } from '../../common/getLinks'
import { isAnySectionUnderReview } from '../../common/isAnySectionUnderReview'
import { BridgeProjectHeaderProps } from '../view/BridgeProjectHeader'

export function getProjectHeader(
  project: Bridge,
  tvlApiResponse: TvlApiResponse,
  implementationChange: ImplementationChangeReportApiResponse | undefined,
): BridgeProjectHeaderProps {
  const charts = tvlApiResponse.projects[project.id.toString()]?.charts
  const { tvl, tvlWeeklyChange } = getTvlWithChange(charts)
  const hasImplementationChanged =
    !!implementationChange?.projects[project.id.toString()]

  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    description: project.display.description,
    tvl: project.config.escrows.length > 0 ? formatUSD(tvl) : undefined,
    tvlWeeklyChange:
      project.config.escrows.length > 0 ? tvlWeeklyChange : undefined,
    hasImplementationChanged,
    destination: getDestination(project.technology.destination),
    validatedBy: project.riskView?.validatedBy,
    type: project.display.category,
    isArchived: project.isArchived,
    isUpcoming: project.isUpcoming,
    isUnderReview: project.isUnderReview,
    showProjectUnderReview: isAnySectionUnderReview(project),
    links: getLinks(project.display.links),
    warning: project.display.warning,
  }
}
