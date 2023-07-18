import cx from 'classnames'
import React from 'react'

import { BridgeDetailsSection } from '../../../pages/bridges-projects/props/getProjectDetails'
import { ScalingDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'
import { HorizontalSeparator } from '../../HorizontalSeparator'
import { SummaryIcon } from '../../icons/projects/SummaryIcon'
import { UnderReviewCallout } from '../UnderReviewCallout'
import { DESKTOP_PROJECT_NAVIGATION_IDS } from './ids'

interface Project {
  title: string
  showProjectUnderReview?: boolean
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
  const translateClassName = project.showProjectUnderReview
    ? '-translate-y-[180px]'
    : '-translate-y-16'
  return (
    <div
      className="sticky top-8"
      id={DESKTOP_PROJECT_NAVIGATION_IDS.container}
      data-is-under-review={project.showProjectUnderReview ?? false}
    >
      <div
        id={DESKTOP_PROJECT_NAVIGATION_IDS.listHeader}
        className={cx(
          '-z-1 opacity-0 transition-all duration-300',
          translateClassName,
        )}
      >
        <div className="flex flex-row items-center gap-4">
          {project.icon && (
            <img
              className="h-8 w-8"
              src={project.icon}
              alt={`${project.title} logo`}
            />
          )}
          <span className="text-xl font-bold lg:text-2xl">{project.title}</span>
        </div>
        {project.showProjectUnderReview && (
          <UnderReviewCallout small className="mt-2" />
        )}
        <HorizontalSeparator className="my-4" />
      </div>
      <div
        className={cx(
          'flex flex-col gap-3 transition-transform duration-300',
          translateClassName,
        )}
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
      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-center text-xs font-bold dark:bg-neutral-700"
      id={DESKTOP_PROJECT_NAVIGATION_IDS.index}
    >
      <span>{props.index}</span>
    </div>
  )
}
