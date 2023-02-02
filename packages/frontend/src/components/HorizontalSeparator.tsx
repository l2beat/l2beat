import cx from 'classnames'
import React from 'react'
export interface SeparatorProps {
  className?: string
}
export function HorizontalSeparator({ className }: SeparatorProps) {
  return (
    <hr
      className={cx(
        'w-full border-gray-300 dark:border-gray-700 md:border-t-2',
        className,
      )}
    />
  )
}
