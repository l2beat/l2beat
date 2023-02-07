import cx from 'classnames'
import React, { ReactNode } from 'react'

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
  gray: 'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800',
  warning: 'text-black bg-yellow-500',
  brightYellow: 'bg-yellow-200 text-purple-700',
  purple: 'bg-pink-900 text-white',
}

export function Badge({
  type,
  className,
  children,
  title,
  oneSize,
}: BadgeProps) {
  return (
    <span
      className={cx(
        'rounded px-1.5 py-px font-medium',
        oneSize ? 'text-sm' : 'text-2xs md:text-sm',
        title && 'Tooltip',
        type && badgeClassnames[type],
        className,
      )}
      title={title}
    >
      {children}
    </span>
  )
}
