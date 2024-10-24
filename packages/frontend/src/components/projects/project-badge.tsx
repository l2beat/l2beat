import { type BadgeId, badges } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'

export function ProjectBadge({ id }: { id: BadgeId }) {
  const meta = badges[id]
  return (
    <Tooltip>
      <TooltipTrigger className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
