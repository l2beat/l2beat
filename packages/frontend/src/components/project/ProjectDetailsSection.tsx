import React, { ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { ProjectSectionId } from './sectionId'
import { UnderReviewCallout } from './UnderReviewCallout'

interface Props {
  title: string
  id: ProjectSectionId
  sectionOrder: number | undefined
  className?: string
  children: ReactNode
  isUnderReview?: boolean
}

export function ProjectDetailsSection(props: Props) {
  return (
    <section
      id={props.id}
      className={cn(
        'mt-10 md:rounded-lg md:bg-gray-100 md:p-8 md:dark:bg-zinc-900',
        props.className,
      )}
    >
      <ProjectDetailsSectionHeader
        title={props.title}
        id={props.id}
        sectionOrder={props.sectionOrder}
        className="mb-6"
      />
      {props.isUnderReview ? <UnderReviewCallout /> : props.children}
    </section>
  )
}

interface ProjectDetailsSectionHeaderProps {
  id: string
  title: string
  sectionOrder: number | undefined
  className?: string
}

export function ProjectDetailsSectionHeader(
  props: ProjectDetailsSectionHeaderProps,
) {
  return (
    <a
      href={`#${props.id}`}
      className={cn(
        'flex items-center gap-4 md:leading-normal',
        props.className,
      )}
    >
      {props.sectionOrder && (
        <div className="hidden h-10 w-10 items-center justify-center rounded bg-gray-200 text-[26px] font-bold tabular-nums text-gray-700 dark:bg-zinc-700 dark:text-zinc-500 md:flex">
          {props.sectionOrder}
        </div>
      )}
      <span className="text-2xl font-bold md:text-4xl">{props.title}</span>
    </a>
  )
}
