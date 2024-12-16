'use client'
import { type ReactNode } from 'react'

import { useBreakpoint } from '~/hooks/use-is-mobile'
import { cn } from '~/utils/cn'
import { UnderReviewCallout } from '../under-review-callout'
import { type ProjectSectionId } from './types'

export interface ExtendedProjectSectionProps {
  title: string
  id: ProjectSectionId
  nested?: boolean
  sectionOrder: string | undefined
  className?: string
  children: ReactNode
  isUnderReview?: boolean
  includeChildrenIfUnderReview?: boolean
  as?: 'section' | 'div'
}

export function ProjectSection(props: ExtendedProjectSectionProps) {
  const Component = props.as ?? 'section'
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  return (
    <Component
      id={props.id}
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className={cn(
        'mt-10',
        !isMobile && 'primary-card rounded-lg bg-surface-primary p-8',
        props.nested && 'mt-10 md:p-0',
        props.className,
      )}
    >
      <ProjectDetailsSectionHeader
        title={props.title}
        id={props.id}
        sectionOrder={props.sectionOrder}
        nested={props.nested}
        className="mb-6"
      />
      {props.isUnderReview ? (
        props.includeChildrenIfUnderReview ? (
          <>
            <UnderReviewCallout className="mb-6" />
            {props.children}
          </>
        ) : (
          <UnderReviewCallout />
        )
      ) : (
        props.children
      )}
    </Component>
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
