import { type Layer2 } from '@l2beat/config'
import {
  type TechnologyChoice,
  type TechnologySectionProps,
} from './technology-section'

export function getTechnologySectionProps(
  project: Layer2,
  items: TechnologyChoice[],
): Pick<TechnologySectionProps, 'isUnderReview' | 'items'> | undefined {
  if (items.length === 0) {
    return undefined
  }

  const areAllUnderReview = items.every((item) => item.isUnderReview)

  const section = {
    isUnderReview:
      !!project.isUnderReview ||
      !!project.technology.isUnderReview ||
      areAllUnderReview,
    items,
  }

  return section
}
