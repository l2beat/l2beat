import React from 'react'

import { ProjectDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'
import { HorizontalSeparator } from '../../HorizontalSeparator'
import { SummaryIcon } from '../../icons/projects/SummaryIcon'

interface SectionNavigationProps {
  title: string
  icon: string | undefined
  sections: ProjectDetailsSection[]
}

export function DesktopSectionNavigation(props: SectionNavigationProps) {
  return (
    <div className="sticky top-8" id="desktop-section-navigation">
      <div id="desktop-section-navigation-header" className="hidden">
        <div className="flex flex-row items-center">
          {props.icon && (
            <img
              className="h-8 w-8"
              src={props.icon}
              alt={`${props.title} logo`}
            />
          )}
          <span className="ml-4 text-2xl font-bold">{props.title}</span>
        </div>
        <HorizontalSeparator className="my-4" />
      </div>
      <div className="flex flex-col gap-3" id="desktop-section-navigation-list">
        <a
          href="#"
          className="flex flex-row items-center gap-3 opacity-60 hover:opacity-100"
          id="desktop-section-navigation-summary"
        >
          <SummaryIcon />
          Summary
        </a>
        <SectionNavigationList sections={props.sections} />
      </div>
    </div>
  )
}

function SectionNavigationList({
  sections,
}: Pick<SectionNavigationProps, 'sections'>) {
  return (
    <>
      {sections.map((section, i) => {
        if (!section.props.id || !section.props.title) return

        return (
          <a
            key={section.props.id}
            href={`#${section.props.id}`}
            className="flex flex-row items-center opacity-60 hover:opacity-100"
          >
            <NavigationListIndex index={i + 1} />
            <span className="ml-3">{section.props.title}</span>
          </a>
        )
      })}
    </>
  )
}

function NavigationListIndex(props: { index: number }) {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-700 text-center text-xs font-bold">
      <span>{props.index}</span>
    </div>
  )
}
