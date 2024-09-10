import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import Layer3sIcon from '~/icons/layer3s.svg'
import ShieldIcon from '~/icons/shield.svg'
import UnderReviewIcon from '~/icons/under-review.svg'
import UnverifiedIcon from '~/icons/unverified.svg'
import { type SyncStatus } from '~/types/sync-status'
import { cn } from '~/utils/cn'
import { NotSyncedBadge } from '../../badge/not-synced-badge'

export interface ProjectCellProps {
  project: {
    name: string
    shortName?: string
    isVerified?: boolean
    redWarning?: string
    showProjectUnderReview?: boolean
    hasImplementationChanged?: boolean
    data?: { syncStatus?: SyncStatus }
  }
  type?: 'layer2' | 'layer3' | 'bridge'
  showIsL3?: boolean
  className?: string
}

export function ProjectNameCell({
  project,
  showIsL3,
  type,
  className,
}: ProjectCellProps) {
  return (
    <div className={cn('flex items-center pl-2 2xl:pl-3', className)}>
      <span className="text-base font-bold md:text-lg">
        {project.shortName ?? project.name}
      </span>
      {showIsL3 && type === 'layer3' && (
        <span className="pl-1.5">
          <div className="inline-block">
            <Layer3sIcon className="relative top-px size-4" />
          </div>
        </span>
      )}
      {project.isVerified === false && (
        <span className="pl-1.5">
          <Tooltip>
            <TooltipTrigger>
              <UnverifiedIcon className="relative top-px size-4 fill-red-300" />
            </TooltipTrigger>
            <TooltipContent>
              This project contains unverified contracts.
            </TooltipContent>
          </Tooltip>
        </span>
      )}
      {project.redWarning && (
        <span className="pl-1.5">
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="relative top-px size-4 fill-red-300" />
            </TooltipTrigger>
            <TooltipContent>{project.redWarning}</TooltipContent>
          </Tooltip>
        </span>
      )}
      {(!!project.showProjectUnderReview ||
        !!project.hasImplementationChanged) && (
        <span className="pl-1.5">
          <Tooltip>
            <TooltipTrigger>
              <UnderReviewIcon className="relative top-px size-4" />
            </TooltipTrigger>
            <TooltipContent>
              {getUnderReviewText(
                project.showProjectUnderReview,
                project.hasImplementationChanged,
              )}
            </TooltipContent>
          </Tooltip>
        </span>
      )}

      {project.data?.syncStatus?.isSynced === false && (
        <div className="mb-1.5 flex items-center justify-center pl-1.5">
          <NotSyncedBadge syncedUntil={project.data?.syncStatus.syncedUntil} />
        </div>
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
