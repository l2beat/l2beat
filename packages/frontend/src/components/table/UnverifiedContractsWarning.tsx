import cx from 'classnames'
import React from 'react'

import { InfoIcon } from '../icons'

export function UnverifiedContractsWarning() {
  return (
    <div className="relative">
      <span
        className={cx(
          'Tooltip inline-block',
          'absolute top-0 -translate-y-1/2 left-[6px]',
        )}
        title="This project includes unverified contracts"
      >
        <InfoIcon
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className="fill-red-300 dark:fill-red-700"
        />
      </span>
    </div>
  )
}
