'use client'
import React from 'react'

import SummaryIcon from '~/icons/pages/summary.svg'
import { cn } from '~/utils/cn'
import Image from 'next/image'
import { HorizontalSeparator } from '~/app/_components/horizontal-separator'
import { UnderReviewCallout } from '../../under-review-callout'
import { type ProjectDetailsSection } from '../types'
import { useCurrentSection } from '~/hooks/use-current-section'

interface Project {
  title: string
  showProjectUnderReview?: boolean
  icon: string | undefined
}
interface ProjectNavigationProps {
  project: Project
  sections: ProjectDetailsSection[]
}

export function DesktopProjectNavigation({
  project,
  sections,
}: ProjectNavigationProps) {
  const currentSection = useCurrentSection()
  const isSummarySection = currentSection && currentSection.id === 'summary'

  const translateClassName = project.showProjectUnderReview
    ? '-translate-y-[189px]'
    : '-translate-y-16'

  return (
    <div
      className="sticky top-8"
      data-is-under-review={project.showProjectUnderReview ?? false}
    >
      <div
        className={cn(
          '-z-1 opacity-0 duration-300 scale-[0.85] transition-all ease-out',
          isSummarySection === true && translateClassName,
          isSummarySection === false && 'opacity-100 scale-100',
        )}
      >
        <div className="flex flex-row items-center gap-4">
          {project.icon && (
            <Image
              width={32}
              height={32}
              src={project.icon}
              alt={`${project.title} logo`}
            />
          )}
          <span className="font-bold text-xl lg:text-2xl">{project.title}</span>
        </div>
        {project.showProjectUnderReview && (
          <UnderReviewCallout small className="mt-2" />
        )}
        <HorizontalSeparator className="my-4" />
      </div>

      <ProjectNavigationList
        sections={sections}
        className={cn(
          (isSummarySection === true || isSummarySection === undefined) &&
            translateClassName,
        )}
      />
    </div>
  )
}

function ProjectNavigationList({
  sections,
  className,
}: Pick<ProjectNavigationProps, 'sections'> & { className?: string }) {
  const currentSection = useCurrentSection()
  return (
    <div
      className={cn(
        'flex flex-col gap-3 transition-transform duration-300',
        className,
      )}
    >
      <a
        href="#"
        className={cn(
          'flex flex-row items-center gap-3 transition-opacity hover:opacity-100',
          currentSection && currentSection.id !== 'summary' && 'opacity-60',
        )}
      >
        <SummaryIcon className="size-6" />
        Summary
      </a>
      {sections.map((section, i) => {
        const selected = currentSection?.id === section.props.id
        if (section.excludeFromNavigation) {
          return null
        }
        return (
          <a
            key={section.props.id}
            href={`#${section.props.id}`}
            className={cn(
              'flex flex-row items-center transition-opacity hover:opacity-100',
              !selected && 'opacity-60',
            )}
          >
            <NavigationListIndex index={i + 1} selected={selected} />
            <span className="ml-3">{section.props.title}</span>
          </a>
        )
      })}
    </div>
  )
}

function NavigationListIndex(props: { index: number; selected: boolean }) {
  return (
    <div
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-lg text-center font-bold text-xs',
        props.selected
          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-white'
          : 'bg-gray-100 dark:bg-neutral-700',
      )}
    >
      <span>{props.index}</span>
    </div>
  )
}
