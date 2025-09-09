import type {
  ProjectEcosystemInfo,
  ProjectScalingCapability,
  ProjectScalingPurpose,
} from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { LiveIndicator } from '~/components/LiveIndicator'
import { Markdown } from '~/components/markdown/Markdown'
import { ProjectBadge } from '~/components/projects/ProjectBadge'
import { useIsMobile } from '~/hooks/useIsMobile'
import { Layer3Icon } from '~/icons/Layer3'
import { SuperchainIcon } from '~/icons/providers/SuperchainIcon'
import { ShieldIcon } from '~/icons/Shield'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { getUnderReviewText } from '~/utils/project/underReview'
import { NoDataIcon } from '../../NoDataIcon'
import { PrimaryValueCell } from './PrimaryValueCell'

interface ProjectCellProps {
  project: Omit<CommonProjectEntry, 'href' | 'slug' | 'id'> & {
    isLayer3?: boolean
    purposes?: ProjectScalingPurpose[]
    capability?: ProjectScalingCapability
    ecosystemInfo?: ProjectEcosystemInfo
  }
  className?: string
  withInfoTooltip?: boolean
  ignoreUnderReviewIcon?: boolean
}

export function ProjectNameCell({
  project,
  className,
  withInfoTooltip,
  ignoreUnderReviewIcon,
}: ProjectCellProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        <PrimaryValueCell className="font-bold leading-none!">
          <NameWithProjectInfoTooltip
            withInfoTooltip={withInfoTooltip}
            project={project}
          />
        </PrimaryValueCell>
        {project.isLayer3 && (
          <Tooltip>
            <TooltipTrigger>
              <Layer3Icon className="size-4" />
            </TooltipTrigger>
            <TooltipContent>{project.nameSecondLine}</TooltipContent>
          </Tooltip>
        )}
        {project.ecosystemInfo?.isPartOfSuperchain && (
          <Tooltip>
            <TooltipTrigger>
              <SuperchainIcon />
            </TooltipTrigger>
            <TooltipContent>
              The project is officially part of the Superchain - it contributes
              revenue to the Optimism Collective and uses the SuperchainConfig
              to manage chain configuration values.
            </TooltipContent>
          </Tooltip>
        )}
        {project.statuses?.verificationWarning === true && (
          <Tooltip>
            <TooltipTrigger>
              <UnverifiedIcon className="size-3.5 fill-red-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>
              This project contains unverified contracts.
            </TooltipContent>
          </Tooltip>
        )}
        {project.statuses?.redWarning && (
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="-top-px relative size-3.5 fill-red-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>{project.statuses.redWarning}</TooltipContent>
          </Tooltip>
        )}
        {project.statuses?.underReview && !ignoreUnderReviewIcon && (
          <Tooltip>
            <TooltipTrigger>
              <UnderReviewIcon className="size-3.5 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>
              {getUnderReviewText(project.statuses.underReview)}
            </TooltipContent>
          </Tooltip>
        )}
        {project.statuses?.yellowWarning && (
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="-top-px relative size-3.5 fill-yellow-700 md:size-4 dark:fill-yellow-300" />
            </TooltipTrigger>
            <TooltipContent>
              <Markdown inline ignoreGlossary>
                {project.statuses.yellowWarning}
              </Markdown>
            </TooltipContent>
          </Tooltip>
        )}
        {project.statuses?.syncWarning && (
          <NoDataIcon content={project.statuses.syncWarning} />
        )}
        {project.statuses?.ongoingAnomaly && (
          <Tooltip>
            <TooltipTrigger>
              <LiveIndicator />
            </TooltipTrigger>
            <TooltipContent>
              There's an ongoing anomaly. Check detailed page for more
              information.
            </TooltipContent>
          </Tooltip>
        )}
      </div>
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
    </div>
  )
}

interface NameWithProjectInfoTooltipProps {
  withInfoTooltip?: boolean
  project: Omit<CommonProjectEntry, 'href' | 'slug' | 'id'>
}

function NameWithProjectInfoTooltip({
  project,
  withInfoTooltip,
}: NameWithProjectInfoTooltipProps) {
  const isMobile = useIsMobile()
  const projectName = project.shortName ?? project.name

  if (
    !withInfoTooltip ||
    isMobile ||
    (!project.description && !project.badges)
  ) {
    return projectName
  }

  return (
    <Tooltip>
      <TooltipTrigger>{projectName}</TooltipTrigger>
      <TooltipContent className="flex flex-col gap-2">
        <span className="text-heading-18">What is {projectName}?</span>
        <p>{project.description}</p>
        <div className="flex max-w-(--breakpoint-xs)! flex-row flex-wrap">
          {project.badges?.map((badge, key) => (
            <ProjectBadge key={key} badge={badge} className="h-16!" />
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
