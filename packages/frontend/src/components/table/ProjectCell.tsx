import React from 'react'

import { ShieldIcon, UnderReviewIcon } from '../icons'
import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface ProjectCellProps {
  project: {
    name: string
    slug: string
    isVerified?: boolean
    isUpcoming?: boolean
    isArchived?: boolean
    redWarning?: string
    showProjectUnderReview?: boolean
    warning?: string
  }
}

export function ProjectCell({ project }: ProjectCellProps) {
  return (
    <div>
      <span className="relative pl-8 group-hover:underline">
        <img
          className="absolute top-0 left-0 inline-block h-[18px] w-[18px]"
          src={`/icons/${project.slug}.png`}
          alt={`${project.name} logo`}
        />
        {project.name.length < 15 ? (
          <span className="text-base font-bold md:text-lg">{project.name}</span>
        ) : (
          <span className="text-base font-bold md:text-lg">{project.name}</span>
        )}
      </span>
      {project.isVerified === false && (
        <span className="pl-1.5">
          <Tooltip className="inline-block">
            <TooltipTrigger>
              <UnverifiedIcon className="relative top-px h-4 w-4 fill-red-300" />
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
              <ShieldIcon className="relative top-px h-4 w-4 fill-red-300" />
            </TooltipTrigger>
            <TooltipContent>{project.redWarning}</TooltipContent>
          </Tooltip>
        </span>
      )}
      {project.showProjectUnderReview && (
        <span className="pl-1.5">
          <Tooltip className="inline-block">
            <TooltipTrigger>
              <UnderReviewIcon className="relative top-px h-4 w-4" />
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
