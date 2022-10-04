import classNames from 'classnames'
import React from 'react'

export function NoInfoCell() {
  return (
    <span
      className={classNames(
        'sm:text-sm md:text-base px-1 rounded-sm',
        'text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800',
      )}
    >
      No info
    </span>
  )
}
