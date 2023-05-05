import React from 'react'

import { BridgeDetailsSection } from '../../../pages/bridges-projects/props/getProjectDetails'
import { ScalingDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'
import { ChevronLeftIcon, ChevronRightIcon } from '../../icons'
import { MOBILE_PROJECT_NAVIGATION_IDS } from './ids'

interface Props {
  sections: (ScalingDetailsSection | BridgeDetailsSection)[]
}

export function MobileProjectNavigation({ sections }: Props) {
  return (
    <div
      id={MOBILE_PROJECT_NAVIGATION_IDS.container}
      className="relative bg-white dark:bg-gray-950"
    >
      <div
        className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white via-white opacity-0 transition-opacity dark:from-gray-950 dark:via-gray-950"
        id={MOBILE_PROJECT_NAVIGATION_IDS.arrowLeft}
      >
        <div className="flex h-full items-center justify-center">
          <ChevronLeftIcon className="scale-75" />
        </div>
      </div>
      <div
        className="scrollbar-hide flex flex-row items-center overflow-x-auto"
        id={MOBILE_PROJECT_NAVIGATION_IDS.list}
      >
        <a
          href="#"
          id={MOBILE_PROJECT_NAVIGATION_IDS.summaryItem}
          className="whitespace-nowrap p-4 text-xs transition-colors"
        >
          Summary
        </a>
        <ProjectNavigationList sections={sections} />
      </div>
      <div
        className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white via-white opacity-0 transition-opacity dark:from-gray-950 dark:via-gray-950"
        id={MOBILE_PROJECT_NAVIGATION_IDS.arrowRight}
      >
        <div className="flex h-full items-center justify-center">
          <ChevronRightIcon className="scale-75" />
        </div>
      </div>
    </div>
  )
}

function ProjectNavigationList({ sections }: Pick<Props, 'sections'>) {
  return (
    <>
      {sections.map((section) => {
        return (
          <a
            key={section.props.id}
            href={`#${section.props.id}`}
            className="whitespace-nowrap p-4 text-xs transition-colors"
          >
            {section.props.title}
          </a>
        )
      })}
    </>
  )
}
