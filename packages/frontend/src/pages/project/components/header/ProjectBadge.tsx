import React from 'react'

import { BadgeId, badges } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../components/tooltip/Tooltip'

export function ProjectBadge({ id }: { id: BadgeId }) {
  const meta = badges[id]
  return (
    <Tooltip>
      <TooltipTrigger>
        <img
          src={`/images/badges/${id}.png`}
          alt={id}
          className="h-[4.5rem] w-auto"
        />
      </TooltipTrigger>
      <TooltipContent>{meta.display.name}</TooltipContent>
    </Tooltip>
  )
}
