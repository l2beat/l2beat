import React from 'react'

import { BadgeId, badges } from '@l2beat/config/build/src/projects/badges'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'

export function ProjectBadge({ id }: { id: BadgeId }) {
  const meta = badges[id]
  return (
    <Tooltip className="flex-shrink-0">
      <TooltipTrigger>
        <img
          src={`/images/badges/${id}.png`}
          alt={`${meta.display.name} badge`}
          className="h-16 w-auto lg:h-[4.5rem]"
        />
      </TooltipTrigger>
      <TooltipContent>
        <span className="mb-2 block font-medium">{meta.display.name}</span>
        <span className="text-xs">{meta.display.description}</span>
      </TooltipContent>
    </Tooltip>
  )
}
