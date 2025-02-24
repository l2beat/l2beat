import type { Badge } from '@l2beat/config'
import type { ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'
export function ProjectBadge({
  badge,
  hideTooltip,
  className,
}: {
  badge: Badge
  hideTooltip?: boolean
  className?: ClassNameValue
}) {
  const badgeImg = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/badges/${badge.id}.png`}
        alt={`${badge.name} badge`}
        className={cn('h-16 w-auto lg:h-[4.5rem]', className)}
      />
    </>
  )

  if (hideTooltip) return badgeImg

  return (
    <Tooltip>
      <TooltipTrigger className="shrink-0">{badgeImg}</TooltipTrigger>
      <TooltipContent>
        <span className="mb-2 block font-medium">{badge.name}</span>
        <span className="text-xs">{badge.description}</span>
      </TooltipContent>
    </Tooltip>
  )
}
