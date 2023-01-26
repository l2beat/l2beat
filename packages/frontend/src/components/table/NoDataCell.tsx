import React from 'react'

import { Badge } from '../badge/Badge'

export function NoDataCell() {
  return (
    <Badge type="gray" title="We don't have data for this item" oneSize>
      No data
    </Badge>
  )
}
