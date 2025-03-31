import type { Badge } from '@l2beat/config'
import Link from 'next/link'
import type { ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../core/tooltip/tooltip'

export type BadgeWithLink = Badge & { href?: string }

interface Props {
  badge: BadgeWithLink
  disableInteraction?: boolean
  className?: ClassNameValue
}

export function ProjectBadge({ badge, disableInteraction, className }: Props) {
  const badgeImg = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/badges/${badge.id}.png`}
      alt={`${badge.name} badge`}
      className={cn(
        'h-16 w-auto lg:h-[4.5rem]',
        !disableInteraction &&
          badge.href &&
          'transition-all hover:scale-[1.08]',
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

  if (disableInteraction) return component

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
