import React from 'react'

import { ProjectDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'
import { ArrowheadLeftIcon, ArrowheadRightIcon } from '../../icons/ArrowHeads'

interface Props {
  sections: ProjectDetailsSection[]
}

export const MOBILE_PROJECT_NAVIGATION_IDS = {
  container: 'mobile-project-navigation',
  list: 'mobile-project-navigation-list',
  summaryItem: 'mobile-project-navigation-summary',
  arrowLeft: 'mobile-project-navigation-arrow-left',
  arrowRight: 'mobile-project-navigation-arrow-right',
}

export function MobileProjectNavigation({ sections }: Props) {
  return (
    <div
      id={MOBILE_PROJECT_NAVIGATION_IDS.container}
      className="relative bg-[#000000]"
    >
      <div
        className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#000000] opacity-0 transition-opacity"
        id={MOBILE_PROJECT_NAVIGATION_IDS.arrowLeft}
      >
        <div className="flex h-full items-center justify-center">
          <ArrowheadLeftIcon className="scale-75" />
        </div>
      </div>
      <div
        className="scrollbar-hide flex flex-row items-center overflow-x-auto"
        id={MOBILE_PROJECT_NAVIGATION_IDS.list}
      >
        <a
          href="#"
          id={MOBILE_PROJECT_NAVIGATION_IDS.summaryItem}
          className="whitespace-nowrap p-4 text-xs"
        >
          Summary
        </a>
        <ProjectNavigationList sections={sections} />
      </div>
      <div
        className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#000000] opacity-0 transition-opacity"
        id={MOBILE_PROJECT_NAVIGATION_IDS.arrowRight}
      >
        <div className="flex h-full items-center justify-center">
          <ArrowheadRightIcon className="scale-75" />
        </div>
      </div>
    </div>
  )
}

function ProjectNavigationList({ sections }: Pick<Props, 'sections'>) {
  return (
    <>
      {sections.map((section) => {
        if (!section.props.id || !section.props.title) return

        return (
          <a
            key={section.props.id}
            href={`#${section.props.id}`}
            className="whitespace-nowrap p-4 text-xs"
          >
            {section.props.title}
          </a>
        )
      })}
    </>
  )
}
