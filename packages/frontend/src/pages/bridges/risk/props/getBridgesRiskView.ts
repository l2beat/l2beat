import { Bridge, Layer2 } from '@l2beat/config'
import { TvlApiResponse, VerificationStatus } from '@l2beat/shared-pure'

import { getDestination } from '../../../../utils/getDestination'
import { getIncludedProjects } from '../../../../utils/getIncludedProjects'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { BridgesRiskViewProps } from '../view/BridgesRiskView'
import { getBridgesRiskViewSortingOrder } from './getBridgesRiskViewSortingOrder'

export function getBridgesRiskView(
  projects: (Layer2 | Bridge)[],
  tvlApiResponse: TvlApiResponse,
  verificationStatus: VerificationStatus,
): BridgesRiskViewProps {
  const included = getIncludedProjects(projects, tvlApiResponse)
  const orderedProjects = orderByTvl(included, tvlApiResponse)

  const items = orderedProjects.map((project) =>
    getBridgesRiskViewEntry(project, verificationStatus),
  )
  return {
    items,
    sortingOrder: getBridgesRiskViewSortingOrder(items),
  }
}

export function getBridgesRiskViewEntry(
  project: Layer2 | Bridge,
  verificationStatus: VerificationStatus,
) {
  return {
    type: project.type,
    name: project.display.name,
    slug: project.display.slug,
    warning: project.display.warning,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isVerified: verificationStatus.projects[project.id.toString()],
    category: project.display.category,
    destination: getDestination(
      project.type === 'bridge'
        ? project.technology.destination
        : [project.display.name],
    ),
    ...project.riskView,
  }
}
