'use client'
import type { ReactNode } from 'react'

import { PrimaryCard } from '~/components/primary-card/primary-card'
import { cn } from '~/utils/cn'
import { UnderReviewCallout } from '../under-review-callout'
import type { ProjectSectionId } from './types'

export interface ExtendedProjectSectionProps {
  title: string
  id: ProjectSectionId
  nested?: boolean
  sectionOrder: string | undefined
  className?: string
  children: ReactNode
  isUnderReview?: boolean
  hideChildrenIfUnderReview?: boolean
  as?: 'section' | 'div'
}

export function ProjectSection(props: ExtendedProjectSectionProps) {
  const Component = props.as ?? 'section'
  return (
    <PrimaryCard
      id={props.id}
      data-role="project-section"
      className={cn(
        'border-divider bg-surface-primary px-4 py-8 max-md:border-b max-md:last:border-none md:mt-10 md:p-8',
        'md:rounded-lg before:md:rounded-lg',
        props.nested && 'mt-10 p-0 md:p-0',
        props.className,
      )}
      asChild
    >
      <Component>
        <ProjectDetailsSectionHeader
          title={props.title}
          id={props.id}
          sectionOrder={props.sectionOrder}
          nested={props.nested}
          className="mb-4"
        />
        {props.isUnderReview ? (
          !props.hideChildrenIfUnderReview ? (
            <>
              <UnderReviewCallout className="mb-4" />
              {props.children}
            </>
          ) : (
            <UnderReviewCallout />
          )
        ) : (
          props.children
        )}
      </Component>
    </PrimaryCard>
  )
}

interface ProjectDetailsSectionHeaderProps {
  id: string
  title: string
  sectionOrder: string | undefined
  nested: boolean | undefined
  className?: string
}

function ProjectDetailsSectionHeader(props: ProjectDetailsSectionHeaderProps) {
  return (
    <a
      href={`#${props.id}`}
      className={cn(
        'flex items-center gap-4 md:leading-normal',
        props.nested && 'gap-3',
        props.className,
      )}
    >
      {props.sectionOrder && (
        <div
          className={cn(
            'hidden size-10 items-center justify-center rounded bg-surface-secondary px-3 text-[26px] font-bold tabular-nums text-secondary md:flex',
            props.nested && 'h-8 w-11 text-xl',
          )}
        >
          {props.sectionOrder}
        </div>
      )}
      <span
        className={cn(
          'text-2xl font-bold md:text-4xl',
          props.nested && 'text-xl md:text-3xl',
        )}
      >
        {props.title}
      </span>
    </a>
  )
}
