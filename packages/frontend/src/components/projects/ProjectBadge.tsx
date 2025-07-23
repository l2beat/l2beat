import type { Badge } from '@l2beat/config'
import type { ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/Tooltip'

export interface BadgeWithParams extends Badge {
  src: string
  width: number
  height: number
  href?: string
}

export function ProjectBadge({
  badge,
  disableInteraction,
  disableTooltip,
  className,
}: {
  badge: BadgeWithParams
  className?: ClassNameValue
  disableTooltip?: boolean
  disableInteraction?: boolean
}) {
  const badgeImg = (
    <img
      src={badge.src}
      alt={`${badge.name} badge`}
      width={badge.width}
      height={badge.height}
      className={cn(
        'h-16 w-auto lg:h-18',
        !disableInteraction &&
          badge.href &&
          'transition-all ease-in-out hover:scale-[1.08]',
        className,
      )}
    />
  )
  const component =
    !disableInteraction && badge.href ? (
      <a href={badge.href}>{badgeImg}</a>
    ) : (
      badgeImg
    )

  if (disableInteraction || disableTooltip) return component

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger className="shrink-0">{component}</TooltipTrigger>
      <TooltipContent>
        <span className="mb-1 block font-medium text-label-value-14">
          {badge.name}
        </span>
        <span>{badge.description}</span>
      </TooltipContent>
    </Tooltip>
  )
}
