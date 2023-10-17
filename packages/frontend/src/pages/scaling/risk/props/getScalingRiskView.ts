import { Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared-pure'

import { isAnySectionUnderReview } from '../../../../utils/project/isAnySectionUnderReview'
import { ScalingRiskViewProps } from '../view/ScalingRiskView'
import { ScalingRiskViewEntry } from '../view/types'

export function getScalingRiskView(
  projects: Layer2[],
  verificationStatus: VerificationStatus,
): ScalingRiskViewProps {
  return {
    items: projects
      .filter((p) => !p.isUpcoming)
      .map((p) =>
        getScalingRiskViewEntry(
          p,
          verificationStatus.projects[p.id.toString()],
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
    slug: project.display.slug,
    provider: project.display.provider,
    warning: project.display.warning,
    isArchived: project.isArchived,
    showProjectUnderReview: isAnySectionUnderReview(project),
    isVerified,
    isUpcoming: project.isUpcoming,
    category: project.display.category,
    stage: project.stage,
    ...project.riskView,
  }
}
