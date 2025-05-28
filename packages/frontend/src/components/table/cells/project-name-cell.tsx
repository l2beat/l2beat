'use client'

import type { CommonProjectEntry } from 'rewrite/src/server/features/utils/get-common-project-entry'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { OtherMigrationTooltip } from '~/components/countdowns/other-migration/other-migration-tooltip'
import { Markdown } from '~/components/markdown/markdown'
import { ProjectBadge } from '~/components/projects/project-badge'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { featureFlags } from '~/consts/feature-flags'
import { useIsMobile } from '~/hooks/use-is-mobile'
import { ShieldIcon } from '~/icons/shield'
import { UnderReviewIcon } from '~/icons/under-review'
import { UnverifiedIcon } from '~/icons/unverified'
import { getUnderReviewText } from '~/utils/project/under-review'
import { NotSyncedIcon } from '../../not-synced/not-synced-icon'
import { PrimaryValueCell } from './primary-value-cell'

export interface ProjectCellProps {
  project: Omit<CommonProjectEntry, 'href' | 'slug' | 'id'>
  className?: string
  withInfoTooltip?: boolean
}

export function ProjectNameCell({
  project,
  className,
  withInfoTooltip,
}: ProjectCellProps) {
  const { checked } = useRecategorisationPreviewContext()
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        <PrimaryValueCell className="font-bold !leading-none">
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
              <ShieldIcon className="relative -top-px size-3.5 fill-red-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>{project.statuses.redWarning}</TooltipContent>
          </Tooltip>
        )}
        {project.statuses?.underReview && (
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
              <ShieldIcon className="relative -top-px size-3.5 fill-yellow-700 dark:fill-yellow-300 md:size-4" />
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
        {!checked &&
          project.statuses?.countdowns?.otherMigration &&
          !featureFlags.othersMigrated() && (
            <OtherMigrationTooltip
              {...project.statuses.countdowns.otherMigration}
            />
          )}
      </div>
      {project.nameSecondLine && (
        <span className="block text-[0.8125rem] font-medium leading-[0.9375rem] text-secondary">
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
          <span className="heading-18">What is {projectName}?</span>
          <p>{project.description}</p>
          <div className="flex !max-w-screen-xs flex-row flex-wrap">
            {project.badges?.map((badge, key) => (
              <ProjectBadge key={key} badge={badge} className="!h-16" />
            ))}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}
