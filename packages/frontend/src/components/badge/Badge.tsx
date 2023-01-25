import cx from 'classnames'
import React, { ReactNode } from 'react'

export enum BadgeType {
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  GRAY = 'GRAY',
  BRIGHT_YELLOW = 'BRIGHT_YELLOW',
  PURPLE = 'PURPLE',
}

export enum BadgeSize {
  MD = 'MD',
  SM = 'SM',
}

export interface BadgeProps {
  type: BadgeType
  size?: BadgeSize
  className?: string
  children: ReactNode
  title?: string
}

const badgeClassnames: { [key in BadgeType | BadgeSize]: string } = {
  [BadgeType.ERROR]: 'text-white bg-red-500',
  [BadgeType.GRAY]:
    'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800',
  [BadgeType.WARNING]: 'text-black bg-yellow-500',
  [BadgeType.BRIGHT_YELLOW]: 'bg-yellow-200 text-purple-700',
  [BadgeType.PURPLE]: 'bg-pink-900 text-white',
  [BadgeSize.MD]: 'text-sm',
  [BadgeSize.SM]: 'text-xs',
}

export function Badge({
  type,
  size = BadgeSize.MD,
  className,
  children,
  title,
}: BadgeProps) {
  return (
    <span
      className={cx(
        'px-1.5 py-px rounded font-medium',
        title && 'Tooltip',
        badgeClassnames[type],
        badgeClassnames[size],
        className,
      )}
      title={title}
    >
      {children}
    </span>
  )
}
