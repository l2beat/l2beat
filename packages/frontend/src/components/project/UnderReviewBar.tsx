import cx from 'classnames'
import React from 'react'

import { UnderReviewIcon } from '../icons'

export function UnderReviewBar({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        'flex justify-center py-2.5 md:px-0',
        'rounded-lg bg-yellow-700/20',
        className,
      )}
    >
      <span className="flex flex-row">
        <span className="flex items-center">
          <UnderReviewIcon />
        </span>
        <span className="ml-2 text-base font-medium">
          This project is under review.
        </span>
      </span>
    </div>
  )
}
