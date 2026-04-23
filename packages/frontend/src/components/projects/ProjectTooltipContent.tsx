import { cva } from 'class-variance-authority'
import type React from 'react'
import { CustomLink } from '../link/CustomLink'
import { Markdown } from '../markdown/Markdown'
import { type BadgeWithParams, ProjectBadge } from './ProjectBadge'

const tooltipSectionVariants = cva('rounded-lg px-3 py-2', {
  variants: {
    variant: {
      negative: 'bg-negative/20 text-black dark:text-white',
      warning: 'bg-warning/20 text-black dark:text-white',
      muted: 'bg-surface-secondary text-black dark:text-white',
    },
  },
})

export const QUANTUM_RESISTANCE_TOOLTIP =
  "The prover is plausibly quantum resistant. There is no publicly known quantum algorithm that efficiently breaks prover's cryptography."

export interface ProjectTooltipSectionData {
  id: string
  text: string
  textDetail?: string
  href?: string
  variant: 'negative' | 'warning' | 'muted'
  icon: React.ReactNode
}

export function ProjectTooltipContent({
  projectName,
  description,
  sections = [],
  badges,
  sectionsFirst = false,
}: {
  projectName: string
  description?: string
  sections?: ProjectTooltipSectionData[]
  badges?: BadgeWithParams[]
  sectionsFirst?: boolean
}) {
  const sectionList = sections.map((section) => (
    <TooltipSection
      key={section.id}
      href={section.href}
      textDetail={section.textDetail}
      variant={section.variant}
      icon={section.icon}
    >
      {section.text}
    </TooltipSection>
  ))

  const badgeList =
    badges && badges.length > 0 ? (
      <div className="flex max-w-(--breakpoint-xs)! flex-row flex-wrap">
        {badges.map((badge) => (
          <ProjectBadge
            key={badge.id}
            badge={badge}
            className="h-16!"
            disableTooltip
          />
        ))}
      </div>
    ) : null

  if (sectionsFirst) {
    return (
      <>
        <span className="text-heading-18">What is {projectName}?</span>
        {sectionList}
        {description && <p>{description}</p>}
        {badgeList}
      </>
    )
  }

  return (
    <>
      <span className="text-heading-18">What is {projectName}?</span>
      {description && <p>{description}</p>}
      {sectionList}
      {badgeList}
    </>
  )
}

function TooltipSection({
  href,
  textDetail,
  variant,
  icon,
  children,
}: {
  href?: string
  textDetail?: string
  variant: 'negative' | 'warning' | 'muted'
  icon: React.ReactNode
  children: string
}) {
  return (
    <div className={tooltipSectionVariants({ variant })}>
      <div className="flex items-start gap-2">
        <div className="shrink-0">{icon}</div>
        <div className="min-w-0">
          <Markdown inline ignoreGlossary>
            {children}
          </Markdown>
          {textDetail && (
            <Markdown ignoreGlossary className="mt-1">
              {textDetail}
            </Markdown>
          )}
          {href && (
            <CustomLink
              href={href}
              className="mt-1 inline-block text-label-value-13"
            >
              View details
            </CustomLink>
          )}
        </div>
      </div>
    </div>
  )
}
