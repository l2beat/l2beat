import React from 'react'

import UnverifiedIcon from '~/icons/unverified.svg'
import UnderReviewIcon from '~/icons/under-review.svg'
import ShieldIcon from '~/icons/shield.svg'
import Layer3sIcon from '~/icons/layer3s.svg'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip'
import { type SyncStatus } from '~/types/SyncStatus'
import { NotSyncedBadge } from '../../badge/not-synced-badge'

export interface ProjectCellProps {
  project: {
    name: string
    shortName?: string
    slug: string
    isVerified?: boolean
    isUpcoming?: boolean
    isArchived?: boolean
    redWarning?: string
    type?: 'layer2' | 'layer3' | 'bridge' | undefined
    showProjectUnderReview?: boolean
    hasImplementationChanged?: boolean
    warning?: string
    data?: { syncStatus?: SyncStatus }
  }
  showIsL3?: boolean
}

export function ProjectNameCell({ project, showIsL3 }: ProjectCellProps) {
  return (
    <div className="pl-2 2xl:pl-3">
      <span className="font-bold text-base md:text-lg group-hover:underline">
        {project.shortName ?? project.name}
      </span>
      {showIsL3 && project.type === 'layer3' && (
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
      {(project.showProjectUnderReview || project.hasImplementationChanged) && (
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
      {project.warning && (
        <span className="pl-1.5">
          <Tooltip>
            <TooltipTrigger>
              <ShieldIcon className="relative top-px h-4 fill-yellow-700 dark:fill-yellow-300" />
            </TooltipTrigger>
            <TooltipContent>{project.warning}</TooltipContent>
          </Tooltip>
        </span>
      )}
      {project.data?.syncStatus?.isSynced === false && (
        <NotSyncedBadge
          className="relative top-[-3px] ml-2"
          syncedUntil={project.data?.syncStatus.syncedUntil}
        />
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
