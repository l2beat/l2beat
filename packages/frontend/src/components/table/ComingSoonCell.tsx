import cx from 'classnames'
import React from 'react'

export function ComingSoonCell() {
  return (
    <span
      className={cx(
        'px-1.5 py-px text-sm rounded',
        'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800',
        'Tooltip',
      )}
      title="This item will be added soon."
    >
      Coming soon
    </span>
  )
}
