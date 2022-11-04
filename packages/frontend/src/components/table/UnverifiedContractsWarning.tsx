import cx from 'classnames'
import React from 'react'

import { InfoIcon } from '../icons'

export interface UnverifiedContractsWarningProps {
  tooltip: string
  className?: string
}

export function UnverifiedContractsWarning({
  className,
  tooltip,
}: UnverifiedContractsWarningProps) {
  return (
    <div className="relative">
      <span className={cx('Tooltip inline-block', className)} title={tooltip}>
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
