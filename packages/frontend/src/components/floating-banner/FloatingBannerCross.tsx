import cx from 'classnames'
import React from 'react'

import { CrossIcon } from '../icons/Cross'

export function FloatingBannerCross() {
  return (
    <div
      className={cx(
        'FloatingBanner-Cross',
        'absolute',
        'top-0',
        'right-0',
        'cursor-pointer',
        'mt-4',
        'mr-4',
      )}
    >
      <CrossIcon className="fill-gray-550 dark:fill-gray-50" />
    </div>
  )
}
