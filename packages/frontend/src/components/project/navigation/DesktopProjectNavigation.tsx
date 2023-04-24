import React from 'react'

import { ProjectDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'
import { HorizontalSeparator } from '../../HorizontalSeparator'
import { SummaryIcon } from '../../icons/projects/SummaryIcon'

interface ProjectNavigationProps {
  title: string
  icon: string | undefined
  sections: ProjectDetailsSection[]
}
export const DESKTOP_PROJECT_NAVIGATION_IDS = {
  container: 'desktop-project-navigation',
  listHeader: 'desktop-project-navigation-header',
  list: 'desktop-project-navigation-list',
  summaryItem: 'desktop-project-navigation-summary',
  index: 'desktop-project-navigation-item-index',
}

export function DesktopProjectNavigation(props: ProjectNavigationProps) {
  return (
    <div className="sticky top-8" id={DESKTOP_PROJECT_NAVIGATION_IDS.container}>
      <div id={DESKTOP_PROJECT_NAVIGATION_IDS.listHeader} className="hidden">
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
      <div
        className="flex flex-col gap-3"
        id={DESKTOP_PROJECT_NAVIGATION_IDS.list}
      >
        <a
          href="#"
          className="flex flex-row items-center gap-3 opacity-60 hover:opacity-100"
          id={DESKTOP_PROJECT_NAVIGATION_IDS.summaryItem}
        >
          <SummaryIcon />
          Summary
        </a>
        <ProjectNavigationList sections={props.sections} />
      </div>
    </div>
  )
}

function ProjectNavigationList({
  sections,
}: Pick<ProjectNavigationProps, 'sections'>) {
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
    <div
      className="flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-700 text-center text-xs font-bold"
      id={DESKTOP_PROJECT_NAVIGATION_IDS.index}
    >
      <span>{props.index}</span>
    </div>
  )
}
