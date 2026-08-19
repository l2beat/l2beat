import type { ReactNode } from 'react'

import { HighlightablePrimaryCard } from '~/components/primary-card/HighlightablePrimaryCard'
import { CompareProjectsLink } from '~/pages/scaling/compare/components/CompareProjectsLink'
import { cn } from '~/utils/cn'
import { UnderReviewCallout } from '../UnderReviewCallout'
import type { ProjectSectionId } from './types'

export interface ExtendedProjectSectionProps {
  title: string
  headerAccessory?: ReactNode
  /**
   * Link to the compare page seeded with this project and the section's
   * metric. Rendered next to the title on desktop and below the content on
   * mobile, so every metric section gets the same entry point.
   */
  compareUrl?: string
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
  const content = (
    <>
      {props.children}
      {props.compareUrl && (
        <CompareProjectsLink
          variant="section"
          href={props.compareUrl}
          className="mt-4 md:hidden"
        >
          Compare with other projects
        </CompareProjectsLink>
      )}
    </>
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
          headerAccessory={
            props.compareUrl ? (
              <div className="flex items-center gap-2 max-md:hidden">
                <CompareProjectsLink variant="section" href={props.compareUrl}>
                  Compare
                </CompareProjectsLink>
                {props.headerAccessory}
              </div>
            ) : (
              props.headerAccessory
            )
          }
          className="mb-4"
        />
        {props.isUnderReview ? (
          !props.hideChildrenIfUnderReview ? (
            <>
              <UnderReviewCallout className="mb-4" />
              {content}
            </>
          ) : (
            <UnderReviewCallout />
          )
        ) : (
          content
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
}

function ProjectDetailsSectionHeader(props: ProjectDetailsSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-4 md:flex-row md:items-center',
        props.className,
      )}
    >
      <a
        href={`#${props.id}`}
        className={cn('flex items-center gap-4', props.nested && 'gap-3')}
      >
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
      </a>
      {props.headerAccessory}
    </div>
  )
}
