import cx from 'classnames'
import React from 'react'

interface IndexCellProps {
  entry: {
    isUpcoming?: boolean
    isArchived?: boolean
  }
  index: number
  className?: string
}

export function IndexCell({ className, index }: IndexCellProps) {
  return (
    <span
      className={cx(
        'text-xs font-medium text-gray-50 dark:font-normal dark:text-gray-600',
        className,
      )}
    >
      {index}
    </span>
  )
}
