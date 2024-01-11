import { Layer2 } from '@l2beat/config'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { ScalingRiskPagesData, ScalingRiskViewEntry } from '../types'
import { ScalingRiskViewProps } from '../view/ScalingRiskView'

export function getScalingRiskView(
  projects: Layer2[],
  pagesData: ScalingRiskPagesData,
): ScalingRiskViewProps {
  const included = projects.filter((p) => !p.isUpcoming)
  const ordered = orderByTvl(included, pagesData.tvlApiResponse)

  return {
    items: ordered
      .filter((p) => !p.isUpcoming)
      .map((p) =>
        getScalingRiskViewEntry(
          p,
          pagesData.verificationStatus.projects[p.id.toString()],
        ),
      ),
  }
}

export function getScalingRiskViewEntry(
  project: Layer2,
  isVerified?: boolean,
): ScalingRiskViewEntry {
  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    provider: project.display.provider,
    purposes: project.display.purposes,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isVerified,
    isUpcoming: project.isUpcoming,
    category: project.display.category,
    stage: project.stage,
    ...project.riskView,
  }
}
