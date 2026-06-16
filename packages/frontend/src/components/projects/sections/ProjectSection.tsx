import type { ReactNode } from 'react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/core/Collapsible'
import { HighlightablePrimaryCard } from '~/components/primary-card/HighlightablePrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { UnderReviewCallout } from '../UnderReviewCallout'
import type { ProjectSectionId } from './types'

export interface ExtendedProjectSectionProps {
  title: string
  headerAccessory?: ReactNode
  id: ProjectSectionId
  nested?: boolean
  sectionOrder: string | undefined
  className?: string
  children: ReactNode
  isUnderReview?: boolean
  hideChildrenIfUnderReview?: boolean
  as?: 'section' | 'div'
  /** Render the section as an expand/collapse block (the header is the toggle). */
  collapsible?: boolean
  /** Initial open state when `collapsible` (defaults to closed). */
  defaultOpen?: boolean
}

export function ProjectSection(props: ExtendedProjectSectionProps) {
  const Component = props.as ?? 'section'

  const body = props.isUnderReview ? (
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
  )

  return (
    <HighlightablePrimaryCard
      id={props.id}
      data-role="nav-section"
      nested={props.nested}
      className={cn(
        'scroll-mt-[38px] px-4 py-8 md:mt-4 md:scroll-mt-14 md:p-6 lg:scroll-mt-4',
        'max-md:border-divider max-md:border-b max-md:last:border-none',
        'md:rounded-lg',
        !props.nested &&
          'border-t-branding-primary md:group-data-[has-colors=true]/section-wrapper:border-t-4',
        props.nested && 'mt-10 p-0 md:p-0',
        // Collapsible (sub)sections read as bordered cards inside their parent.
        props.collapsible &&
          'mt-0 rounded-lg border border-divider p-4 md:mt-0 md:p-4',
        props.className,
      )}
      asChild
    >
      <Component>
        {props.collapsible ? (
          <Collapsible defaultOpen={props.defaultOpen ?? false}>
            <ProjectDetailsSectionHeader
              title={props.title}
              id={props.id}
              sectionOrder={props.sectionOrder}
              nested={props.nested}
              headerAccessory={props.headerAccessory}
              collapsible
            />
            <CollapsibleContent className="mt-4">{body}</CollapsibleContent>
          </Collapsible>
        ) : (
          <>
            <ProjectDetailsSectionHeader
              title={props.title}
              id={props.id}
              sectionOrder={props.sectionOrder}
              nested={props.nested}
              headerAccessory={props.headerAccessory}
              className="mb-4"
            />
            {body}
          </>
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
  headerAccessory?: ReactNode
  collapsible?: boolean
}

function ProjectDetailsSectionHeader(props: ProjectDetailsSectionHeaderProps) {
  const titleContent = (
    <>
      {props.sectionOrder && (
        <div
          className={cn(
            'hidden size-10 items-center justify-center rounded bg-surface-secondary font-bold text-label-value-24 text-secondary tabular-nums md:flex',
            props.nested && 'h-8 w-12 text-label-value-18',
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
      {props.collapsible && (
        <ChevronIcon className="size-3 shrink-0 transition-transform group-data-[state=open]/Collapsible:rotate-180" />
      )}
    </>
  )

  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-4 md:flex-row md:items-center',
        props.className,
      )}
    >
      {props.collapsible ? (
        <CollapsibleTrigger
          className={cn(
            'flex cursor-pointer items-center gap-4',
            props.nested && 'gap-3',
          )}
        >
          {titleContent}
        </CollapsibleTrigger>
      ) : (
        <a
          href={`#${props.id}`}
          className={cn('flex items-center gap-4', props.nested && 'gap-3')}
        >
          {titleContent}
        </a>
      )}
      {props.headerAccessory}
    </div>
  )
}
