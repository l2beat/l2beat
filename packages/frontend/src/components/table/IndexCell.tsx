import cx from 'classnames'
import React from 'react'

interface IndexCellProps {
  entry: {
    isUpcoming?: boolean
    isArchived?: boolean
  }
  className?: string
}

export function IndexCell({ className }: IndexCellProps) {
  return (
    <span
      className={cx(
        'text-xs font-medium text-gray-50 dark:font-normal dark:text-gray-600',
        className,
      )}
      data-role="index-cell"
    />
    // the number is set dynamically inside the client-side code
    // see renderNumbers() inside /packages/frontend/src/scripts/configureFilters.ts
  )
}
