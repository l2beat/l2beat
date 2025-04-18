import type { Badge } from '@l2beat/config'
import Image from 'next/image'
import Link from 'next/link'
import type { ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'

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
    <Image
      src={badge.src}
      alt={`${badge.name} badge`}
      width={badge.width}
      height={badge.height}
      className={cn(
        'h-16 w-auto lg:h-[4.5rem]',
        !disableInteraction &&
          badge.href &&
          'transition-all ease-in-out hover:scale-[1.08]',
        className,
      )}
    />
  )
  const component =
    !disableInteraction && badge.href ? (
      <Link href={badge.href}>{badgeImg}</Link>
    ) : (
      badgeImg
    )

  if (disableInteraction || disableTooltip) return component

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger className="shrink-0">{component}</TooltipTrigger>
      <TooltipContent>
        <span className="mb-2 block font-medium">{badge.name}</span>
        <span className="text-xs">{badge.description}</span>
      </TooltipContent>
    </Tooltip>
  )
}
