import cx from 'classnames'
import React from 'react'

import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'
import { Tooltip } from '../tooltip/Tooltip'

export interface UnverifiedContractsWarningProps {
  tooltip: string
  className?: string
}

export function UnverifiedContractsWarning({
  className,
  tooltip,
}: UnverifiedContractsWarningProps) {
  return (
    <Tooltip className={cx('inline-block', className)} content={tooltip}>
      <UnverifiedIcon className={cx('fill-red-300')} />
    </Tooltip>
  )
}
