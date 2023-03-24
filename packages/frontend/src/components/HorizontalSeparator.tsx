import cx from 'classnames'
import React from 'react'
export interface SeparatorProps {
  className?: string
}
export function HorizontalSeparator({ className }: SeparatorProps) {
  return (
    <hr
      className={cx(
        'w-full border-gray-200 dark:border-gray-850 md:border-t-2',
        className,
      )}
    />
  )
}
