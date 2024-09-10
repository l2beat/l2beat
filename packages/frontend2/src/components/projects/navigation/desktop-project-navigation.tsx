'use client'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'

import Image from 'next/image'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { useCurrentSection } from '~/hooks/use-current-section'
import SummaryIcon from '~/icons/pages/summary.svg'
import { cn } from '~/utils/cn'
import { UnderReviewCallout } from '../under-review-callout'
import { type ProjectNavigationSection } from './types'

interface Project {
  title: string
  showProjectUnderReview?: boolean
  slug: string
}
interface ProjectNavigationProps {
  project: Project
  sections: ProjectNavigationSection[]
}

export function DesktopProjectNavigation({
  project,
  sections,
}: ProjectNavigationProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState<number>()
  const currentSection = useCurrentSection()
  const isSummarySection = currentSection && currentSection.id === 'summary'

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    setHeaderHeight(header.getBoundingClientRect().height)
  }, [headerRef])

  const style = useMemo(() => {
    if (!headerHeight) return undefined
    return {
      top: `${headerHeight + 16}px`,
    }
  }, [headerHeight])

  return (
    <div className="sticky top-8">
      <div className="relative">
        <div
          ref={headerRef}
          className={cn(
            '-z-1 opacity-0 transition-opacity duration-300',
            isSummarySection === false && 'opacity-100',
          )}
        >
          <div className="flex flex-row items-center gap-4">
            {project.slug && (
              <Image
                width={32}
                height={32}
                src={`/icons/${project.slug}.png`}
                alt={`${project.title} logo`}
              />
            )}
            <span className="text-xl font-bold lg:text-2xl">
              {project.title}
            </span>
          </div>
          {project.showProjectUnderReview && (
            <UnderReviewCallout small className="mt-2" />
          )}
          <HorizontalSeparator className="my-4" />
        </div>

        <ProjectNavigationList
          sections={sections}
          style={isSummarySection === false ? style : undefined}
        />
      </div>
    </div>
  )
}

function ProjectNavigationList({
  sections,
  style,
}: Pick<ProjectNavigationProps, 'sections'> & { style?: CSSProperties }) {
  const currentSection = useCurrentSection()
  return (
    <div
      className="absolute top-0 flex flex-col gap-3 leading-none transition-[top] duration-300"
      style={style}
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
        const selected = currentSection?.id === section.id
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              'flex flex-row items-center transition-opacity hover:opacity-100',
              !selected && 'opacity-60',
            )}
          >
            <NavigationListIndex index={i + 1} selected={selected} />
            <span className="ml-3">{section.title}</span>
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
        'flex size-6 shrink-0 items-center justify-center rounded-lg text-center text-xs font-bold',
        props.selected
          ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-white'
          : 'bg-gray-100 dark:bg-neutral-700',
      )}
    >
      <span>{props.index}</span>
    </div>
  )
}
