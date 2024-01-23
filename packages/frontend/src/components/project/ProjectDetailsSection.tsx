import cx from 'classnames'
import React, { ReactNode } from 'react'

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
      className={cx(props.className, 'rounded-lg bg-zinc-900 p-8 md:mt-10')}
    >
      <a
        href={`#${props.id}`}
        className="mb-6 flex items-center gap-4 md:leading-normal"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded bg-zinc-800 text-2xl tabular-nums text-gray-600">
          {props.sectionOrder}
        </div>
        <span className="text-2xl font-bold md:text-4xl">{props.title}</span>
      </a>
      {props.isUnderReview ? <UnderReviewCallout /> : props.children}
    </section>
  )
}
