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
      title={
        props.isUpcoming
          ? 'The project is not yet deployed on Ethereum Mainnet'
          : "We don't have data for this item"
      }
      oneSize
    >
      {props.isUpcoming ? 'Coming soon' : 'No data'}
    </Badge>
  )
}
