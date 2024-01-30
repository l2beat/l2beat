import React, { ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

type BadgeType = 'error' | 'warning' | 'brightYellow' | 'gray' | 'purple'

export interface BadgeProps {
  type?: BadgeType
  className?: string
  children: ReactNode
  title?: string
  oneSize?: boolean
}

const badgeClassnames: Record<BadgeType, string> = {
  error: 'text-white bg-red-500',
  gray: 'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-zinc-700',
  warning: 'text-black bg-yellow-500',
  brightYellow: 'bg-yellow-200 text-purple-700',
  purple: 'bg-pink-900 text-white',
}

export function Badge(props: BadgeProps) {
  const className = cn(
    'rounded px-1.5 py-px font-medium',
    props.oneSize ? 'text-sm' : 'text-2xs md:text-sm',
    props.type && badgeClassnames[props.type],
    props.className,
  )

  if (props.title) {
    return (
      <Tooltip>
        <TooltipTrigger className={className}>{props.children}</TooltipTrigger>
        <TooltipContent>{props.title}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <span className={className} title={props.title}>
      {props.children}
    </span>
  )
}
