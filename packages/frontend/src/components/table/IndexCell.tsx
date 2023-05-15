import cx from 'classnames'
import React from 'react'

interface IndexCellProps {
  index: number
  className?: string
}

// the number is updated dynamically inside the client-side code on the bridges page
// see renderNumbers() inside /packages/frontend/src/scripts/configureCanonicalBridgesFilter.ts
export function IndexCell({ index, className }: IndexCellProps) {
  return (
    <span
      className={cx(
        'text-xs font-medium text-gray-50 dark:font-normal dark:text-gray-600',
        className,
      )}
      data-role="index-cell"
    >
      {index + 1}
    </span>
  )
}
