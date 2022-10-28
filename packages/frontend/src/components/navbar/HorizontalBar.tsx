import cx from 'classnames'
import React from 'react'

export function HorizontalBar({ className }: { className?: string }) {
  return (
    <hr
      className={cx(
        'h-px text-gray-100 dark:text-gray-900 border-current -mx-4',
        className,
      )}
    />
  )
}
