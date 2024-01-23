import React, { ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { ProjectSectionId } from './sectionId'
import { UnderReviewCallout } from './UnderReviewCallout'

interface Props {
  title: string
  id: ProjectSectionId
  sectionOrder: number
  className?: string
  children: ReactNode
  isUnderReview?: boolean
}

export function ProjectDetailsSection(props: Props) {
  return (
    <section
      id={props.id}
      className={cn(
        'mt-10 md:rounded-lg md:bg-zinc-900 md:p-8',
        props.className,
      )}
    >
      <a
        href={`#${props.id}`}
        className="mb-6 flex items-center gap-4 md:leading-normal"
      >
        <div className="hidden h-10 w-10 items-center justify-center rounded bg-zinc-800 text-2xl tabular-nums text-gray-600 md:flex">
          {props.sectionOrder}
        </div>
        <span className="text-2xl font-bold md:text-4xl">{props.title}</span>
      </a>
      {props.isUnderReview ? <UnderReviewCallout /> : props.children}
    </section>
  )
}
