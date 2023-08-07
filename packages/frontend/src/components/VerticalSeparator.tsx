import cx from 'classnames'
import React from 'react'
export interface SeparatorProps {
  className?: string
}
export function VerticalSeparator({ className }: SeparatorProps) {
  return (
    <hr
      className={cx(
        'h-full border-gray-200 dark:border-gray-850 md:border-l-2',
        className,
      )}
    />
  )
}
