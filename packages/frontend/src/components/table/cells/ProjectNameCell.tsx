import type {
  ProjectEcosystemInfo,
  ProjectScalingCapability,
  ProjectScalingPurpose,
} from '@l2beat/config'
import { cva } from 'class-variance-authority'
import type React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { LiveIndicator } from '~/components/LiveIndicator'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import { ProjectBadge } from '~/components/projects/ProjectBadge'
import { ClockIcon } from '~/icons/Clock'
import { Layer3Icon } from '~/icons/Layer3'
import { SuperchainIcon } from '~/icons/providers/SuperchainIcon'
import { ShieldIcon } from '~/icons/Shield'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { cn } from '~/utils/cn'
import { getUnderReviewText } from '~/utils/project/underReview'
import { PrimaryValueCell } from './PrimaryValueCell'

const tooltipSectionVariants = cva('rounded-lg px-3 py-2', {
  variants: {
    variant: {
      negative: 'bg-negative/20 text-black dark:text-white',
      warning: 'bg-warning/20 text-black dark:text-white',
      muted: 'bg-surface-secondary text-black dark:text-white',
    },
  },
})

export type ProjectCellProject = Omit<CommonProjectEntry, 'href' | 'id'> & {
  isLayer3?: boolean
  purposes?: ProjectScalingPurpose[]
  capability?: ProjectScalingCapability
  ecosystemInfo?: ProjectEcosystemInfo
}

interface ProjectCellProps {
  project: ProjectCellProject
  className?: string
  withInfoTooltip?: boolean
  ignoreUnderReviewIcon?: boolean
}

function redWarningDetailHref(project: ProjectCellProject): string | undefined {
  const anchor = project.statuses?.redWarning?.detailAnchor
  return anchor ? `/scaling/projects/${project.slug}#${anchor}` : undefined
}

function MobileProjectIconTooltip({
  icon,
  children,
  contentClassName,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  contentClassName?: string
}) {
  return (
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger>{icon}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent sideOffset={16} className={contentClassName}>
          {children}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

function DesktopStatusIcons({
  project,
  ignoreUnderReviewIcon,
}: {
  project: ProjectCellProject
  ignoreUnderReviewIcon?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      {project.isLayer3 && <Layer3Icon className="size-4" />}
      {project.ecosystemInfo?.isPartOfSuperchain && <SuperchainIcon />}
      {project.statuses?.verificationWarnings &&
        Object.values(project.statuses.verificationWarnings).some(
          (value) => value !== undefined,
        ) && <UnverifiedIcon className="size-4 fill-red-300" />}
      {project.statuses?.redWarning && (
        <ShieldIcon className="size-4 fill-red-300" />
      )}
      {project.statuses?.underReview && !ignoreUnderReviewIcon && (
        <UnderReviewIcon className="size-4" />
      )}
      {project.statuses?.yellowWarning && (
        <ShieldIcon className="size-4 fill-yellow-700 dark:fill-yellow-300" />
      )}
      {project.statuses?.syncWarning && <ClockIcon className="size-4" />}
      {project.statuses?.ongoingAnomaly && <LiveIndicator />}
    </div>
  )
}

export function ProjectNameMobileStatusIcons({
  project,
  ignoreUnderReviewIcon,
  className,
}: {
  project: ProjectCellProject
  ignoreUnderReviewIcon?: boolean
  className?: string
}) {
  const redWarningHref = redWarningDetailHref(project)
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {project.isLayer3 && (
        <MobileProjectIconTooltip icon={<Layer3Icon className="size-4" />}>
          {project.nameSecondLine}
        </MobileProjectIconTooltip>
      )}
      {project.ecosystemInfo?.isPartOfSuperchain && (
        <MobileProjectIconTooltip icon={<SuperchainIcon />}>
          The project is officially part of the Superchain - it contributes
          revenue to the Optimism Collective and uses the SuperchainConfig to
          manage chain configuration values.
        </MobileProjectIconTooltip>
      )}
      {project.statuses?.verificationWarnings &&
        Object.values(project.statuses.verificationWarnings).some(
          (value) => value !== undefined,
        ) && (
          <MobileProjectIconTooltip
            icon={<UnverifiedIcon className="size-4 fill-red-300" />}
            contentClassName="flex flex-col gap-2"
          >
            {project.statuses.verificationWarnings.contracts && (
              <>
                <p>{project.statuses.verificationWarnings.contracts}</p>
                <CustomLink
                  href={`/scaling/projects/${project.slug}#contracts`}
                  className="inline-block text-label-value-13"
                >
                  View details
                </CustomLink>
              </>
            )}
            {project.statuses.verificationWarnings.programHashes && (
              <>
                <p>{project.statuses.verificationWarnings.programHashes}</p>
                <CustomLink
                  href={`/scaling/projects/${project.slug}#program-hashes`}
                  className="inline-block text-label-value-13"
                >
                  View details
                </CustomLink>
              </>
            )}
          </MobileProjectIconTooltip>
        )}
      {project.statuses?.redWarning && (
        <MobileProjectIconTooltip
          icon={<ShieldIcon className="size-4 fill-red-300" />}
          contentClassName="flex flex-col gap-2"
        >
          <Markdown inline ignoreGlossary>
            {project.statuses.redWarning.text}
          </Markdown>
          {redWarningHref && (
            <CustomLink
              href={redWarningHref}
              className="inline-block text-label-value-13"
            >
              View details
            </CustomLink>
          )}
        </MobileProjectIconTooltip>
      )}
      {project.statuses?.underReview && !ignoreUnderReviewIcon && (
        <MobileProjectIconTooltip icon={<UnderReviewIcon className="size-4" />}>
          {getUnderReviewText(project.statuses.underReview)}
        </MobileProjectIconTooltip>
      )}
      {project.statuses?.yellowWarning && (
        <MobileProjectIconTooltip
          icon={
            <ShieldIcon className="size-4 fill-yellow-700 dark:fill-yellow-300" />
          }
        >
          <Markdown inline ignoreGlossary>
            {project.statuses.yellowWarning}
          </Markdown>
        </MobileProjectIconTooltip>
      )}
      {project.statuses?.syncWarning && (
        <MobileProjectIconTooltip icon={<ClockIcon className="size-4" />}>
          {project.statuses.syncWarning}
        </MobileProjectIconTooltip>
      )}
      {project.statuses?.ongoingAnomaly && (
        <MobileProjectIconTooltip
          icon={<LiveIndicator />}
          contentClassName="flex flex-col gap-2"
        >
          <p>
            There's an ongoing anomaly. Check detailed page for more
            information.
          </p>
          <CustomLink
            href={`/scaling/projects/${project.slug}#liveness`}
            className="inline-block text-label-value-13"
          >
            View details
          </CustomLink>
        </MobileProjectIconTooltip>
      )}
    </div>
  )
}

function CellBottomContent({ project }: { project: ProjectCellProject }) {
  return (
    <>
      {project.nameSecondLine && !project.isLayer3 && (
        <span className="block font-medium text-[0.8125rem] text-secondary leading-3.75">
          {project.nameSecondLine}
        </span>
      )}
      {project.capability === 'appchain' &&
        project.purposes &&
        project.purposes?.length > 0 && (
          <div className="text-[13px] text-secondary leading-[14px] md:text-xs md:leading-[15px]">
            {project.purposes.join(', ')}
          </div>
        )}
    </>
  )
}

export function ProjectNameCell({
  project,
  className,
  withInfoTooltip,
  ignoreUnderReviewIcon,
}: ProjectCellProps) {
  const projectName = project.shortName ?? project.name

  if (!withInfoTooltip) {
    return (
      <div className={className}>
        <div className="flex items-center gap-1.5">
          <PrimaryValueCell className="font-bold leading-none!">
            {projectName}
          </PrimaryValueCell>
          <ProjectNameMobileStatusIcons
            project={project}
            ignoreUnderReviewIcon={ignoreUnderReviewIcon}
          />
        </div>
        <CellBottomContent project={project} />
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="max-md:hidden">
        <div className="flex items-center gap-1.5">
          <PrimaryValueCell className="font-bold leading-none!">
            {projectName}
          </PrimaryValueCell>
          <DesktopStatusIcons
            project={project}
            ignoreUnderReviewIcon={ignoreUnderReviewIcon}
          />
        </div>
        <CellBottomContent project={project} />
      </div>
      <div className="md:hidden">
        <div className="flex items-center gap-1.5">
          <PrimaryValueCell className="font-bold leading-none!">
            {projectName}
          </PrimaryValueCell>
        </div>
        <CellBottomContent project={project} />
      </div>
    </div>
  )
}

export function ProjectNameInfoTooltip({
  project,
  children,
}: {
  project: ProjectCellProject
  children: React.ReactElement
}) {
  const projectName = project.shortName ?? project.name
  const warningSections = getTooltipWarningSections(project)
  const hasTooltipContent =
    !!project.description ||
    (project.badges?.length ?? 0) > 0 ||
    warningSections.length > 0

  if (!hasTooltipContent) {
    return children
  }

  return (
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger disabledOnMobile asChild>
        {children}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent sideOffset={16} className="flex flex-col gap-2">
          <span className="text-heading-18">What is {projectName}?</span>
          {warningSections.map((section) => (
            <TooltipSection
              key={section.id}
              href={section.href}
              variant={section.variant}
              icon={section.icon}
            >
              {section.text}
            </TooltipSection>
          ))}
          {project.description && <p>{project.description}</p>}
          {project.badges && project.badges.length > 0 && (
            <div className="flex max-w-(--breakpoint-xs)! flex-row flex-wrap">
              {project.badges.map((badge) => (
                <ProjectBadge
                  key={badge.id}
                  badge={badge}
                  className="h-16!"
                  disableTooltip
                />
              ))}
            </div>
          )}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

interface TooltipSectionProps {
  href?: string
  variant: 'negative' | 'warning' | 'muted'
  icon: React.ReactNode
  children: string
}

function TooltipSection({
  href,
  variant,
  icon,
  children,
}: TooltipSectionProps) {
  return (
    <div className={tooltipSectionVariants({ variant })}>
      <div className="flex items-start gap-2">
        <div className="shrink-0">{icon}</div>
        <div className="min-w-0">
          <Markdown inline ignoreGlossary>
            {children}
          </Markdown>
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

function getTooltipWarningSections(project: ProjectCellProject) {
  const sections: Array<{
    id: string
    text: string
    href?: string
    variant: 'negative' | 'warning' | 'muted'
    icon: React.ReactNode
  }> = []

  if (project.ecosystemInfo?.isPartOfSuperchain) {
    sections.push({
      id: 'superchain',
      text: 'The project is officially part of the Superchain - it contributes revenue to the Optimism Collective and uses the SuperchainConfig to manage chain configuration values.',
      variant: 'muted',
      icon: <SuperchainIcon />,
    })
  }

  if (project.statuses?.verificationWarnings?.contracts) {
    sections.push({
      id: 'contracts',
      text: project.statuses.verificationWarnings.contracts,
      href: `/scaling/projects/${project.slug}#contracts`,
      variant: 'negative',
      icon: <UnverifiedIcon className="size-4" />,
    })
  }

  if (project.statuses?.verificationWarnings?.programHashes) {
    sections.push({
      id: 'program-hashes',
      text: project.statuses.verificationWarnings.programHashes,
      href: `/scaling/projects/${project.slug}#program-hashes`,
      variant: 'negative',
      icon: <UnverifiedIcon className="size-4" />,
    })
  }

  if (project.statuses?.redWarning) {
    sections.push({
      id: 'red-warning',
      text: project.statuses.redWarning.text,
      href: redWarningDetailHref(project),
      variant: 'negative',
      icon: <ShieldIcon className="size-4 fill-red-300" />,
    })
  }

  if (project.statuses?.underReview) {
    sections.push({
      id: 'under-review',
      text: getUnderReviewText(project.statuses.underReview),
      variant: 'warning',
      icon: <UnderReviewIcon className="size-4" />,
    })
  }

  if (project.statuses?.yellowWarning) {
    sections.push({
      id: 'yellow-warning',
      text: project.statuses.yellowWarning,
      variant: 'warning',
      icon: (
        <ShieldIcon className="size-4 fill-yellow-700 dark:fill-yellow-300" />
      ),
    })
  }

  if (project.statuses?.syncWarning) {
    sections.push({
      id: 'sync-warning',
      text: project.statuses.syncWarning,
      variant: 'muted',
      icon: <ClockIcon className="size-4" />,
    })
  }

  if (project.statuses?.ongoingAnomaly) {
    sections.push({
      id: 'ongoing-anomaly',
      text: "There's an ongoing anomaly. Check detailed page for more information.",
      href: `/scaling/projects/${project.slug}#liveness`,
      variant: 'negative',
      icon: (
        <span className="flex h-4 shrink-0 items-center pb-px">
          <LiveIndicator />
        </span>
      ),
    })
  }

  return sections
}
