import React from 'react'

import { BridgeDetailsSection } from '../../../pages/bridges-projects/props/getProjectDetails'
import { ScalingDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'
import { HorizontalSeparator } from '../../HorizontalSeparator'
import { SummaryIcon } from '../../icons/projects/SummaryIcon'
import { DESKTOP_PROJECT_NAVIGATION_IDS } from './ids'

interface Project {
  title: string
  icon: string | undefined
}
interface ProjectNavigationProps {
  project: Project
  sections: (ScalingDetailsSection | BridgeDetailsSection)[]
}

export function DesktopProjectNavigation({
  project,
  sections,
}: ProjectNavigationProps) {
  return (
    <div className="sticky top-8" id={DESKTOP_PROJECT_NAVIGATION_IDS.container}>
      <div
        id={DESKTOP_PROJECT_NAVIGATION_IDS.listHeader}
        className="-translate-y-16 opacity-0 transition-all duration-300"
      >
        <div className="flex flex-row items-center gap-4">
          {project.icon && (
            <img
              className="h-8 w-8"
              src={project.icon}
              alt={`${project.title} logo`}
            />
          )}
          <span className="text-2xl font-bold">{project.title}</span>
        </div>
        <HorizontalSeparator className="my-4" />
      </div>
      <div
        className="flex -translate-y-16 flex-col gap-3 transition-transform duration-300"
        id={DESKTOP_PROJECT_NAVIGATION_IDS.list}
      >
        <a
          href="#"
          className="flex flex-row items-center gap-3 opacity-60 transition-opacity hover:opacity-100"
          id={DESKTOP_PROJECT_NAVIGATION_IDS.summaryItem}
        >
          <SummaryIcon />
          Summary
        </a>
        <ProjectNavigationList sections={sections} />
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
        return (
          <a
            key={section.props.id}
            href={`#${section.props.id}`}
            className="flex flex-row items-center opacity-60 transition-opacity hover:opacity-100"
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
      className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 text-center text-xs font-bold dark:bg-neutral-700"
      id={DESKTOP_PROJECT_NAVIGATION_IDS.index}
    >
      <span>{props.index}</span>
    </div>
  )
}
