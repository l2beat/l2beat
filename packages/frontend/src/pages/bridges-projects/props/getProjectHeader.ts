import { Bridge } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/types'

import { getDestination } from '../../../utils/getDestination'
import { getTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'
import { ProjectHeaderProps } from '../view/ProjectHeader'

export function getProjectHeader(
  project: Bridge,
  tvlApiResponse: TvlApiResponse,
): ProjectHeaderProps {
  const charts = tvlApiResponse.projects[project.id.toString()]?.charts
  const { tvl, tvlWeeklyChange } = getTvlWithChange(charts)

  return {
    icon: `/icons/${project.display.slug}.png`,
    title: project.display.name,
    tvl: formatUSD(tvl),
    tvlWeeklyChange,
    destination: getDestination(project.technology.destination),
    validatedBy: project.riskView?.validatedBy,
    type: project.technology.category,
  }
}
