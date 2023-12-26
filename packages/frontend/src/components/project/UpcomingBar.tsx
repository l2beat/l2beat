import cx from 'classnames'
import React from 'react'

import { UpcomingIcon } from '../icons/symbols/UpcomingIcon'

export function UpcomingBar({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        'flex justify-center py-2.5 md:px-0',
        'rounded-lg bg-purple-100 text-white dark:bg-purple-100',
        className,
      )}
    >
      <span className="flex flex-row">
        <span className="flex items-center">
          <UpcomingIcon />
        </span>
        <span className="ml-2 text-base font-medium dark:text-white">
          This is an upcoming project.{' '}
          <span className="hidden md:inline">Stay tuned!</span>
        </span>
      </span>
    </div>
  )
}
