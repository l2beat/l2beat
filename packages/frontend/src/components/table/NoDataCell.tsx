import React from 'react'

import { Badge } from '../badge/Badge'

export interface NoDataCellProps {
  isUpcoming?: boolean
}

export function NoDataCell(props: NoDataCellProps) {
  return (
    <Badge type="gray" title="We don't have data for this item" oneSize>
      {props.isUpcoming ? 'Coming soon' : 'No data'}
    </Badge>
  )
}
