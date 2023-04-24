import React from 'react'
import { ProjectDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'

interface Props {
  sections: ProjectDetailsSection[]
}

export function MobileSectionNavigation({ sections }: Props) {
  return (
    <div
      id="mobile-section-navigation"
      className="scroll overflow-x-auto bg-[#000000]"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        scrollbarColor: 'transparent transparent',
      }}
    >
      <div
        className="flex flex-row items-center"
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
