import React from 'react'

import { OverflowWrapper } from '../../../components/OverflowWrapper'
import { ProjectDetailsSection } from './sections/types'

interface Props {
  sections: ProjectDetailsSection[]
}

export function MobileProjectNavigation({ sections }: Props) {
  if (sections.length === 0) return null

  return (
    <OverflowWrapper
      className="bg-white dark:bg-neutral-900"
      disableScrollOnLoad
    >
      <div className="flex items-center">
        <a
          href="#"
          data-role="mobile-project-navigation-summary-item"
          className="whitespace-nowrap p-4 text-xs transition-colors data-[selected=true]:border-b-2 data-[selected=true]:border-current data-[selected=true]:text-pink-900 data-[selected=true]:dark:text-pink-200"
        >
          Summary
        </a>
        <ProjectNavigationList sections={sections} />
      </div>
    </OverflowWrapper>
  )
}

function ProjectNavigationList({ sections }: Pick<Props, 'sections'>) {
  return (
    <>
      {sections.map((section) => {
        if (section.excludeFromNavigation) {
          return null
        }
        return (
          <a
            key={section.props.id}
            href={`#${section.props.id}`}
            className="whitespace-nowrap p-4 text-xs transition-colors data-[selected=true]:border-b-2 data-[selected=true]:border-current data-[selected=true]:text-pink-900 data-[selected=true]:dark:text-pink-200"
          >
            {section.props.title}
          </a>
        )
      })}
    </>
  )
}
