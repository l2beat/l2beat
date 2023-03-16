import cx from 'classnames'
import React from 'react'

import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'

export interface UnverifiedContractsWarningProps {
  tooltip: string
  className?: string
}

export function UnverifiedContractsWarning({
  className,
  tooltip,
}: UnverifiedContractsWarningProps) {
  return (
    <span className={cx('Tooltip inline-block', className)} title={tooltip}>
      <UnverifiedIcon className={cx('fill-red-300')} />
    </span>
  )
}
