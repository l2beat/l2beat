import cx from 'classnames'
import React from 'react'
export interface SeparatorProps {
  className?: string
}
export function HorizontalSeparator({ className }: SeparatorProps) {
  return (
    <hr
      className={cx(
        'w-full md:border-t-2 border-gray-300 dark:border-gray-700',
        className,
      )}
    />
  )
}
