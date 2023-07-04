import cx from 'classnames'
import React from 'react'

import { UnderReviewIcon } from '../icons'

export function UnderReviewBar() {
  return (
    <div
      className={cx(
        'mb-6 flex justify-center py-2.5 md:px-0',
        'rounded-lg bg-yellow-700/20',
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
