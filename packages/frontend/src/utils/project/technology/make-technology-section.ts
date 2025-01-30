import type { ProjectTechnologyChoice } from '@l2beat/config'
import type { ProjectDetailsRelatedProjectBannerProps } from '~/components/project-details-related-project-banner'
import type { TechnologyChoice } from '../../../components/projects/sections/technology-section'

export function makeTechnologyChoice(
  id: string,
  item: ProjectTechnologyChoice,
  options: {
    relatedProjectBanner?: ProjectDetailsRelatedProjectBannerProps
  } = {},
): TechnologyChoice {
  const risks = item.risks.map((risk) => ({
    text: `${risk.category} ${risk.text}`,
    isCritical: !!risk.isCritical,
  }))

  return {
    id,
    name: item.name,
    description: item.description,
    isIncomplete: !!item.isIncomplete,
    isUnderReview: !!item.isUnderReview,
    references: item.references,
    risks,
    ...options,
  }
}
