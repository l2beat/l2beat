import React from 'react'
import { ProjectDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'
import { ArrowheadLeftIcon, ArrowheadRightIcon } from '../../icons/ArrowHeads'

interface Props {
  sections: ProjectDetailsSection[]
}

export function MobileSectionNavigation({ sections }: Props) {
  return (
    <div id="mobile-section-navigation" className="relative bg-[#000000]">
      <div
        className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#000000] opacity-0 transition-opacity"
        id="mobile-section-navigation-arrow-left"
      >
        <div className="flex h-full items-center justify-center">
          <ArrowheadLeftIcon className="scale-75" />
        </div>
      </div>
      <div
        className="flex flex-row items-center overflow-x-auto"
        id="mobile-section-navigation-list"
      >
        <a
          href="#"
          id="mobile-section-navigation-summary"
          className="whitespace-nowrap p-4 text-xs"
        >
          Summary
        </a>
        <MobileNavigationList sections={sections} />
      </div>
      <div
        className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#000000] opacity-0 transition-opacity"
        id="mobile-section-navigation-arrow-right"
      >
        <div className="flex h-full items-center justify-center">
          <ArrowheadRightIcon className="scale-75" />
        </div>
      </div>
    </div>
  )
}

function MobileNavigationList({ sections }: Pick<Props, 'sections'>) {
  return (
    <>
      {sections.map((section) => {
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
