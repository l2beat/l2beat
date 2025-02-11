import type { ProjectBadgeMeta } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'
export function ProjectBadge({ badge }: { badge: ProjectBadgeMeta }) {
  return (
    <Tooltip>
      <TooltipTrigger className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/badges/${badge.id}.png`}
          alt={`${badge.display.name} badge`}
          className="h-16 w-auto lg:h-[4.5rem]"
        />
      </TooltipTrigger>
      <TooltipContent>
        <span className="mb-2 block font-medium">{badge.display.name}</span>
        <span className="text-xs">{badge.display.description}</span>
      </TooltipContent>
    </Tooltip>
  )
}
