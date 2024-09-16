import { notUndefined } from '@l2beat/shared-pure'
import { type ProjectDetailsSection } from '../sections/types'

export type ProjectNavigationSection = {
  id: string
  title: string
}

export function projectDetailsToNavigationSections(
  sections: ProjectDetailsSection[],
): ProjectNavigationSection[] {
  return sections
    .map((section) => {
      if (section.excludeFromNavigation) {
        return undefined
      }

      return {
        id: section.props.id,
        title: section.props.title,
      }
    })
    .filter(notUndefined)
}
