import { Bridge, Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared-pure'

import { getDestination } from '../../../../utils/getDestination'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { BridgesPagesData } from '../../types'
import { BridgesRiskViewProps } from '../view/BridgesRiskView'

export function getBridgesRiskView(
  projects: (Layer2 | Bridge)[],
  pagesData: BridgesPagesData,
): BridgesRiskViewProps {
  const { tvlApiResponse, verificationStatus } = pagesData

  const orderedProjects = orderByTvl(projects, tvlApiResponse)

  return {
    items: orderedProjects.map((project) =>
      getBridgesRiskViewEntry(project, verificationStatus),
    ),
  }
}

export function getBridgesRiskViewEntry(
  project: Layer2 | Bridge,
  verificationStatus: VerificationStatus,
) {
  return {
    type: project.type,
    name: project.display.name,
    shortName: project.display.shortName,
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
