import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { Markdown } from '~/components/markdown/markdown'
import { ShieldIcon } from '~/icons/shield'
import { UnderReviewIcon } from '~/icons/under-review'
import { UnverifiedIcon } from '~/icons/unverified'
import { type SyncStatus } from '~/types/sync-status'
import { NotSyncedBadge } from '../../badge/not-synced-badge'

export interface ProjectCellProps {
  project: {
    name: string
    shortName?: string
    isVerified?: boolean
    headerWarning?: string
    redWarning?: string
    showProjectUnderReview?: boolean
    hasImplementationChanged?: boolean
    data?: { syncStatus?: SyncStatus }
    hostChain?: string
  }
  className?: string
}

export function ProjectNameCell({ project, className }: ProjectCellProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold !leading-none md:text-base">
          {project.shortName ?? project.name}
        </span>
        {project.isVerified === false && (
          <Tooltip>
            <TooltipTrigger>
              <UnverifiedIcon className="size-3.5 fill-red-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>
              This project contains unverified contracts.
            </TooltipContent>
          </Tooltip>
        )}
        {project.redWarning && (
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="relative -top-px size-3.5 fill-red-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>{project.redWarning}</TooltipContent>
          </Tooltip>
        )}
        {(!!project.showProjectUnderReview ||
          !!project.hasImplementationChanged) && (
          <Tooltip>
            <TooltipTrigger>
              <UnderReviewIcon className="size-3.5 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>
              {getUnderReviewText(
                project.showProjectUnderReview,
                project.hasImplementationChanged,
              )}
            </TooltipContent>
          </Tooltip>
        )}
        {project.headerWarning && (
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="relative -top-px size-3.5 fill-yellow-700 dark:fill-yellow-300 md:size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <Markdown inline ignoreGlossary>
                {project.headerWarning}
              </Markdown>
            </TooltipContent>
          </Tooltip>
        )}
        {project.data?.syncStatus?.isSynced === false && (
          <NotSyncedBadge syncedUntil={project.data?.syncStatus.syncedUntil} />
        )}
      </div>
      {project.hostChain && (
        <span className="block text-[0.8125rem] font-medium leading-[0.9375rem] text-secondary">
          L3 on {project.hostChain}
        </span>
      )}
    </div>
  )
}

// TODO: Move it somewhere else later
function getUnderReviewText(
  isUnderReview: boolean | undefined,
  hasImplementationChanged: boolean | undefined,
) {
  switch (true) {
    case isUnderReview && hasImplementationChanged:
      return 'There are implementation changes and part of the information might be outdated. The project is under review.'
    case isUnderReview:
      return 'This project is under review.'
    case hasImplementationChanged:
      return 'There are implementation changes and part of the information might be outdated.'
    default:
      return ''
  }
}
