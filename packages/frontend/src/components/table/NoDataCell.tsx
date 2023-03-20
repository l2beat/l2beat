import cx from 'classnames'
import React from 'react'

import { Badge } from '../badge/Badge'

export interface NoDataCellProps {
  isUpcoming?: boolean
  className?: string
}

export function NoDataCell(props: NoDataCellProps) {
  return (
    <Badge
      className={cx(props.className)}
      type="gray"
      title="We don't have data for this item"
      oneSize
    >
      {props.isUpcoming ? 'Coming soon' : 'No data'}
    </Badge>
  )
}
