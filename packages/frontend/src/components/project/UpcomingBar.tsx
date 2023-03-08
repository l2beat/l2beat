import cx from 'classnames'
import React from 'react'

import { UpcomingIcon } from '../icons/symbols/UpcomingIcon'

export function UpcomingBar() {
  return (
    <div
      className={cx(
        'mb-6 flex justify-center py-2.5 md:px-0',
        'rounded-lg bg-purple-100 text-white dark:bg-purple-100',
      )}
    >
      <span className="flex flex-row">
        <span className="flex items-center">
          <UpcomingIcon />
        </span>
        <span className="ml-2 text-base font-medium dark:text-white">
          <span className="md:hidden">This is an upcoming project</span>
          <span className="hidden md:block">
            This is an upcoming project. Stay tuned!
          </span>
        </span>
      </span>
    </div>
  )
}
