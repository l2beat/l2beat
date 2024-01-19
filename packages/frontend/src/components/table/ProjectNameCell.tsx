import React from 'react'

import { ShieldIcon, UnderReviewIcon } from '../icons'
import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface ProjectCellProps {
  project: {
    name: string
    shortName?: string
    slug: string
    isVerified?: boolean
    isUpcoming?: boolean
    isArchived?: boolean
    redWarning?: string
    showProjectUnderReview?: boolean
    warning?: string
  }
}

export function ProjectNameCell({ project }: ProjectCellProps) {
  return (
    <div className="pl-3">
      <span className="text-base font-bold group-hover:underline md:text-lg">
        {project.shortName ?? project.name}
      </span>
      {project.isVerified === false && (
        <span className="pl-1.5">
          <Tooltip className="inline-block">
            <TooltipTrigger>
              <UnverifiedIcon className="size-4 relative top-px fill-red-300" />
            </TooltipTrigger>
            <TooltipContent>
              This project contains unverified contracts.
            </TooltipContent>
          </Tooltip>
        </span>
      )}
      {project.redWarning && (
        <span className="pl-1.5">
          <Tooltip className="inline-block">
            <TooltipTrigger>
              <ShieldIcon className="size-4 relative top-px fill-red-300" />
            </TooltipTrigger>
            <TooltipContent>{project.redWarning}</TooltipContent>
          </Tooltip>
        </span>
      )}
      {project.showProjectUnderReview && (
        <span className="pl-1.5">
          <Tooltip className="inline-block">
            <TooltipTrigger>
              <UnderReviewIcon className="size-4 relative top-px" />
            </TooltipTrigger>
            <TooltipContent>This project is under review.</TooltipContent>
          </Tooltip>
        </span>
      )}
      {project.warning && (
        <span className="pl-1.5">
          <Tooltip className="inline-block">
            <TooltipTrigger>
              <ShieldIcon className="relative top-px h-4 fill-yellow-700 dark:fill-yellow-300" />
            </TooltipTrigger>
            <TooltipContent>{project.warning}</TooltipContent>
          </Tooltip>
        </span>
      )}
    </div>
  )
}
