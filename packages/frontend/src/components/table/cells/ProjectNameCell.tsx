import type {
  ProjectEcosystemInfo,
  ProjectScalingCapability,
  ProjectScalingPurpose,
} from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { LiveIndicator } from '~/components/LiveIndicator'
import { CustomLink } from '~/components/link/CustomLink'
import { Markdown } from '~/components/markdown/Markdown'
import {
  ProjectTooltipContent,
  type ProjectTooltipSectionData,
} from '~/components/projects/ProjectTooltipContent'
import {
  QUANTUM_RESISTANCE_TOOLTIPS,
  type QuantumResistanceType,
} from '~/components/projects/quantumResistanceTooltips'
import { ClockIcon } from '~/icons/Clock'
import { Layer3Icon } from '~/icons/Layer3'
import { SuperchainIcon } from '~/icons/providers/SuperchainIcon'
import { QuantumResistanceIcon } from '~/icons/QuantumResistance'
import { ShieldIcon } from '~/icons/Shield'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { getUnderReviewText } from '~/utils/project/underReview'
import { PrimaryValueCell } from './PrimaryValueCell'

export type ProjectCellProject = Omit<CommonProjectEntry, 'href' | 'id'> & {
  isLayer3?: boolean
  purposes?: ProjectScalingPurpose[]
  capability?: ProjectScalingCapability
  ecosystemInfo?: ProjectEcosystemInfo
  quantumResistance?: QuantumResistanceType
  /** Project page that warning anchors resolve against; defaults to the L2 page. */
  detailsHref?: string
}

interface ProjectCellProps {
  project: ProjectCellProject
  className?: string
  withInfoTooltip?: boolean
  ignoreUnderReviewIcon?: boolean
}

function redWarningDetailHref(project: ProjectCellProject): string | undefined {
  const anchor = project.statuses?.redWarning?.detailAnchor
  if (!anchor) return undefined
  const detailsHref = project.detailsHref ?? `/layer2s/projects/${project.slug}`
  return `${detailsHref}#${anchor}`
}

function MobileProjectIconTooltip({
  icon,
  label,
  children,
  contentClassName,
}: {
  icon: React.ReactNode
  /** The icon alone says nothing to a screen reader. */
  label: string
  children: React.ReactNode
  contentClassName?: string
}) {
  return (
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger aria-label={label}>{icon}</TooltipTrigger>
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
  className,
}: {
  project: ProjectCellProject
  ignoreUnderReviewIcon?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {project.isLayer3 && <Layer3Icon className="size-4" />}
      {project.ecosystemInfo?.isPartOfSuperchain && <SuperchainIcon />}
      {project.quantumResistance && (
        <QuantumResistanceIcon className="size-4" />
      )}
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
        <MobileProjectIconTooltip
          label="Layer 3"
          icon={<Layer3Icon className="size-4" />}
        >
          {project.nameSecondLine}
        </MobileProjectIconTooltip>
      )}
      {project.ecosystemInfo?.isPartOfSuperchain && (
        <MobileProjectIconTooltip
          label="Part of the Superchain"
          icon={<SuperchainIcon />}
        >
          The project is officially part of the Superchain - it contributes
          revenue to the Optimism Collective and uses the SuperchainConfig to
          manage chain configuration values.
        </MobileProjectIconTooltip>
      )}
      {project.quantumResistance && (
        <MobileProjectIconTooltip
          label="Quantum resistance"
          icon={<QuantumResistanceIcon className="size-4" />}
        >
          {QUANTUM_RESISTANCE_TOOLTIPS[project.quantumResistance]}
        </MobileProjectIconTooltip>
      )}
      {project.statuses?.verificationWarnings &&
        Object.values(project.statuses.verificationWarnings).some(
          (value) => value !== undefined,
        ) && (
          <MobileProjectIconTooltip
            label="Verification warning"
            icon={<UnverifiedIcon className="size-4 fill-red-300" />}
            contentClassName="flex flex-col gap-2"
          >
            {project.statuses.verificationWarnings.contracts && (
              <>
                <p>{project.statuses.verificationWarnings.contracts}</p>
                <CustomLink
                  href={`/layer2s/projects/${project.slug}#contracts`}
                  className="inline-block text-label-value-13"
                >
                  View details
                </CustomLink>
              </>
            )}
            {project.statuses.verificationWarnings.programHashes && (
              <>
                <p>{project.statuses.verificationWarnings.programHashes}</p>
                {project.statuses.verificationWarnings
                  .programHashesDescription && (
                  <Markdown ignoreGlossary>
                    {
                      project.statuses.verificationWarnings
                        .programHashesDescription
                    }
                  </Markdown>
                )}
                <CustomLink
                  href={`/layer2s/projects/${project.slug}#program-hashes`}
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
          label="Red warning"
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
        <MobileProjectIconTooltip
          label="Under review"
          icon={<UnderReviewIcon className="size-4" />}
        >
          {getUnderReviewText(project.statuses.underReview)}
        </MobileProjectIconTooltip>
      )}
      {project.statuses?.yellowWarning && (
        <MobileProjectIconTooltip
          label="Warning"
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
        <MobileProjectIconTooltip
          label="Sync delay"
          icon={<ClockIcon className="size-4" />}
        >
          {project.statuses.syncWarning}
        </MobileProjectIconTooltip>
      )}
      {project.statuses?.ongoingAnomaly && (
        <MobileProjectIconTooltip
          label="Ongoing anomaly"
          icon={<LiveIndicator />}
          contentClassName="flex flex-col gap-2"
        >
          <p>
            There's an ongoing anomaly. Check detailed page for more
            information.
          </p>
          <CustomLink
            href={`/layer2s/projects/${project.slug}#liveness`}
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

function DesktopProjectNameContent({
  project,
  ignoreUnderReviewIcon,
}: {
  project: ProjectCellProject
  ignoreUnderReviewIcon?: boolean
}) {
  const projectName = project.shortName ?? project.name

  return (
    <div className="max-md:hidden">
      <div className="flex items-center">
        <PrimaryValueCell className="font-bold leading-none!">
          {projectName}
        </PrimaryValueCell>
        <DesktopStatusIcons
          project={project}
          ignoreUnderReviewIcon={ignoreUnderReviewIcon}
          className="ml-1.5"
        />
      </div>
      <CellBottomContent project={project} />
    </div>
  )
}

function MobileProjectNameContent({
  project,
  ignoreUnderReviewIcon,
}: {
  project: ProjectCellProject
  ignoreUnderReviewIcon?: boolean
}) {
  const projectName = project.shortName ?? project.name

  return (
    <div className="md:hidden">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <PrimaryValueCell className="font-bold leading-none!">
            {projectName}
          </PrimaryValueCell>
          <ProjectNameMobileStatusIcons
            className="shrink-0"
            project={project}
            ignoreUnderReviewIcon={ignoreUnderReviewIcon}
          />
        </div>
        <CellBottomContent project={project} />
      </div>
    </div>
  )
}

export function ProjectNameCell({
  project,
  className,
  withInfoTooltip,
  ignoreUnderReviewIcon,
}: ProjectCellProps) {
  if (!withInfoTooltip) {
    return (
      <div className={className}>
        <MobileProjectNameContent
          project={project}
          ignoreUnderReviewIcon={ignoreUnderReviewIcon}
        />
        <DesktopProjectNameContent
          project={project}
          ignoreUnderReviewIcon={ignoreUnderReviewIcon}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      <DesktopProjectNameContent
        project={project}
        ignoreUnderReviewIcon={ignoreUnderReviewIcon}
      />
      <MobileProjectNameContent
        project={project}
        ignoreUnderReviewIcon={ignoreUnderReviewIcon}
      />
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
  const sections = getTooltipSections(project)
  const lazyDetails = useLazyTooltipDetails(project.lazyTooltipProjectId)
  const hasTooltipContent =
    !!project.description ||
    !!project.lazyTooltipProjectId ||
    !!project.quantumResistance ||
    sections.length > 0

  if (!hasTooltipContent) {
    return children
  }

  return (
    <Tooltip disableHoverableContent={false}>
      <TooltipTrigger
        disabledOnTouch
        asChild
        onPointerEnter={lazyDetails.loadSoon}
        onPointerLeave={lazyDetails.cancelLoadSoon}
        onFocus={lazyDetails.load}
      >
        {children}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent sideOffset={16} className="flex flex-col gap-2">
          <ProjectTooltipContent
            projectName={projectName}
            description={project.description ?? lazyDetails.data?.description}
            sections={sections}
            badges={lazyDetails.data?.badges}
            sectionsFirst
          />
          {lazyDetails.isLoading && <Skeleton className="h-10 w-full" />}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

/**
 * Starts the request once the pointer has rested on the name for a moment,
 * so the details are usually there when the tooltip opens 300 ms in, while a
 * pointer sweeping across the table sends nothing.
 */
function useLazyTooltipDetails(projectId: string | undefined) {
  const trpc = useTRPC()
  const [wanted, setWanted] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const query = useQuery(
    trpc.projects.nameTooltip.queryOptions(
      { projectId: projectId ?? '' },
      { enabled: !!projectId && wanted, staleTime: Number.POSITIVE_INFINITY },
    ),
  )

  const load = () => setWanted(true)
  const cancelLoadSoon = () => clearTimeout(timer.current)
  const loadSoon = () => {
    cancelLoadSoon()
    timer.current = setTimeout(load, 100)
  }
  useEffect(() => () => clearTimeout(timer.current), [])

  return {
    data: query.data,
    isLoading: !!projectId && (!wanted || query.isLoading),
    load,
    loadSoon,
    cancelLoadSoon,
  }
}

function getTooltipSections(project: ProjectCellProject) {
  const sections: ProjectTooltipSectionData[] = []

  if (project.quantumResistance) {
    sections.push({
      id: 'quantum-resistance',
      text: QUANTUM_RESISTANCE_TOOLTIPS[project.quantumResistance],
      variant: 'muted',
      icon: <QuantumResistanceIcon className="size-4" />,
    })
  }

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
      href: `/layer2s/projects/${project.slug}#contracts`,
      variant: 'negative',
      icon: <UnverifiedIcon className="size-4" />,
    })
  }

  if (project.statuses?.verificationWarnings?.programHashes) {
    sections.push({
      id: 'program-hashes',
      text: project.statuses.verificationWarnings.programHashes,
      textDetail:
        project.statuses.verificationWarnings.programHashesDescription,
      href: `/layer2s/projects/${project.slug}#program-hashes`,
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
      href: `/layer2s/projects/${project.slug}#liveness`,
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
