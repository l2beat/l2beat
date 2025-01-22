'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { OtherMigrationTooltip } from '~/components/countdowns/other-migration/other-migration-tooltip'
import { Markdown } from '~/components/markdown/markdown'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { featureFlags } from '~/consts/feature-flags'
import { ShieldIcon } from '~/icons/shield'
import { UnderReviewIcon } from '~/icons/under-review'
import { UnverifiedIcon } from '~/icons/unverified'
import { type CommonProjectEntry } from '~/server/features/utils/get-common-project-entry'
import { getUnderReviewText } from '~/utils/project/under-review'
import { NotSyncedIcon } from '../../not-synced/not-synced-icon'
import { PrimaryValueCell } from './primary-value-cell'

export interface ProjectCellProps {
  project: Omit<CommonProjectEntry, 'href' | 'slug' | 'id'>
  className?: string
}

export function ProjectNameCell({ project, className }: ProjectCellProps) {
  const { checked } = useRecategorisationPreviewContext()
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        <PrimaryValueCell className="font-bold !leading-none">
          {project.shortName ?? project.name}
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
