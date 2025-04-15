import type { Project } from '@l2beat/config'
import type { TechnologyChoice } from '../../../components/projects/sections/technology-section'

export function getTechnologySectionProps(
  project: Project<'statuses' | 'scalingTechnology'>,
  items: TechnologyChoice[],
): { items: TechnologyChoice[]; isUnderReview: boolean } | undefined {
  if (items.length === 0 && !project.statuses.isUnderReview) {
    return undefined
  }

  const isUnderReview =
    items.every((x) => x.isUnderReview) || project.statuses.isUnderReview

  return {
    isUnderReview,
    items,
  }
}
