import type { Project } from '@l2beat/config'
import type { TechnologyChoice } from '../../../components/projects/sections/technology-section'

export function getTechnologySectionProps(
  project: Project<'statuses' | 'scalingTechnology'>,
  items: TechnologyChoice[],
): { items: TechnologyChoice[]; isUnderReview: boolean } | undefined {
  if (items.length === 0) {
    return undefined
  }
  const nonEmptyItems = items.filter((i) => i.name !== 'Empty')
  return {
    isUnderReview:
      nonEmptyItems.every((x) => x.isUnderReview) ||
      project.statuses.isUnderReview,
    items: nonEmptyItems,
  }
}
