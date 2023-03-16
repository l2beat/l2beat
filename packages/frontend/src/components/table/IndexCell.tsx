import cx from 'classnames'
import React from 'react'

import { ArchivedIcon } from '../icons/symbols/ArchivedIcon'
interface IndexCellProps {
  entry: {
    isUpcoming?: boolean
    isArchived?: boolean
  }
  index: number
  className?: string
}

export function IndexCell({ entry, className, index }: IndexCellProps) {
  if (entry.isUpcoming === true) {
    return null
  }

  if (entry.isArchived === true) {
    return (
      <span className={className}>
        <ArchivedIcon />
      </span>
    )
  }

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
