import type { ReactNode } from 'react'

import { HighlightablePrimaryCard } from '~/components/primary-card/HighlightablePrimaryCard'
import { cn } from '~/utils/cn'
import { UnderReviewCallout } from '../UnderReviewCallout'
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
    <HighlightablePrimaryCard
      id={props.id}
      data-role="project-section"
      className={cn(
        'scroll-mt-[38px] px-4 py-8 md:mt-4 md:scroll-mt-4 md:p-6',
        'max-md:border-divider max-md:border-b max-md:last:border-none',
        'md:rounded-lg',
        !props.nested &&
          'border-t-branding-primary md:group-data-[has-colors=true]/section-wrapper:border-t-4',
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
    </HighlightablePrimaryCard>
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
        'flex items-center gap-4',
        props.nested && 'gap-3',
        props.className,
      )}
    >
      {props.sectionOrder && (
        <div
          className={cn(
            'hidden size-[26px] items-center justify-center rounded bg-surface-secondary px-3 text-heading-18 text-secondary tabular-nums leading-none! md:flex',
            props.nested && 'h-[26px] w-10',
          )}
        >
          {props.sectionOrder}
        </div>
      )}
      <span
        className={cn(
          'text-heading-28',
          props.nested && 'text-heading-24 leading-none!',
        )}
      >
        {props.title}
      </span>
    </a>
  )
}
