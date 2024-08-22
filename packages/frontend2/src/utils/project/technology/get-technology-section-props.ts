import { type Bridge, type Layer2, type Layer3 } from '@l2beat/config'
import {
  type TechnologyChoice,
  type TechnologySectionProps,
} from '../../../app/_components/projects/sections/technology-section'
import { type ProjectSectionProps } from '../../../app/_components/projects/sections/types'

export function getTechnologySectionProps(
  project: Layer2 | Layer3 | Bridge,
  items: TechnologyChoice[],
):
  | Omit<
      TechnologySectionProps,
      keyof Omit<ProjectSectionProps, 'isUnderReview'>
    >
  | undefined {
  if (items.length === 0) {
    return undefined
  }

  const areAllUnderReview = items.every((item) => item.isUnderReview)

  return {
    isUnderReview:
      !!project.isUnderReview ||
      !!project.technology.isUnderReview ||
      areAllUnderReview,
    items,
  }
}
