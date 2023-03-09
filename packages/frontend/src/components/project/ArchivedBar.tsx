import cx from 'classnames'
import React from 'react'

import { ArchivedIcon } from '../icons/symbols/ArchivedIcon'

export function ArchivedBar() {
  return (
    <div
      className={cx(
        'mb-6 flex justify-center py-2.5',
        'rounded-lg bg-gray-200 dark:bg-gray-800',
      )}
    >
      <span className="flex flex-row">
        <span className="flex items-center">
          <ArchivedIcon />
        </span>
        <span className="ml-2 text-base font-medium">
          <span className="md:hidden">This project is archived.</span>
          <span className="hidden md:block">
            This project is archived and no longer maintained.
          </span>
        </span>
      </span>
    </div>
  )
}
