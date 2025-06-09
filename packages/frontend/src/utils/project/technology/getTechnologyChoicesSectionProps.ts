import type { Project } from '@l2beat/config'
import type { TechnologyChoice } from '../../../components/projects/sections/TechnologyChoicesSection'

export function getTechnologyChoicesSectionProps(
  project: Project<'statuses' | 'scalingTechnology'>,
  items: TechnologyChoice[],
): { items: TechnologyChoice[]; isUnderReview: boolean } | undefined {
  if (items.length === 0 && !project.statuses.reviewStatus) {
    return undefined
  }

  const isUnderReview =
    items.every((x) => x.isUnderReview) || !!project.statuses.reviewStatus

  return {
    isUnderReview,
    items,
  }
}
