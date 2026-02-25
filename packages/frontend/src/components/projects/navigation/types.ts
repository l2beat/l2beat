import { notUndefined } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '../sections/types'

export type ProjectNavigationSection = {
  id: string
  title: string
  subsections?: {
    id: string
    title: string
  }[]
}

export function projectDetailsToNavigationSections(
  sections: ProjectDetailsSection[],
): ProjectNavigationSection[] {
  return [
    {
      id: 'summary',
      title: 'Summary',
    },
    ...sections
      .map((section) => {
        if (section.excludeFromNavigation) {
          return undefined
        }

        return {
          id: section.props.id,
          title: section.sideNavTitle ?? section.props.title,
          subsections:
            section.type === 'Group'
              ? section.props.items
                  .map((item) => {
                    if (item.excludeFromNavigation) {
                      return undefined
                    }

                    return {
                      id: item.props.id,
                      title: item.props.title,
                    }
                  })
                  .filter(notUndefined)
              : undefined,
        }
      })
      .filter(notUndefined),
  ]
}
