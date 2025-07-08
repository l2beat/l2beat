import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { Markdown } from '~/components/markdown/Markdown'
import { ProjectBadge } from '~/components/projects/ProjectBadge'
import { useIsMobile } from '~/hooks/useIsMobile'
import { ShieldIcon } from '~/icons/Shield'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import type { CommonProjectEntry } from '~/server/features/utils/getCommonProjectEntry'
import { getUnderReviewText } from '~/utils/project/underReview'
import { NotSyncedIcon } from '../../not-synced/NotSyncedIcon'
import { PrimaryValueCell } from './PrimaryValueCell'

export interface ProjectCellProps {
  project: Omit<CommonProjectEntry, 'href' | 'slug' | 'id'>
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
        <PrimaryValueCell className="!leading-none font-bold">
          <NameWithProjectInfoTooltip
            withInfoTooltip={withInfoTooltip}
            project={project}
          />
        </PrimaryValueCell>
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
          <NotSyncedIcon content={project.statuses.syncWarning} />
        )}
      </div>
      {project.nameSecondLine && (
        <span className="block font-medium text-[0.8125rem] text-secondary leading-[0.9375rem]">
          {project.nameSecondLine}
        </span>
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
      <TooltipPortal>
        <TooltipContent className="flex flex-col gap-2">
          <span className="text-heading-18">What is {projectName}?</span>
          <p>{project.description}</p>
          <div className="!max-w-screen-xs flex flex-row flex-wrap">
            {project.badges?.map((badge, key) => (
              <ProjectBadge key={key} badge={badge} className="!h-16" />
            ))}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
