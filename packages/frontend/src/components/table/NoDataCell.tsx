import React from 'react'

import { Badge, BadgeType } from '../badge/Badge'

export function NoDataCell() {
  return (
    <Badge type={BadgeType.GRAY} title="We don't have data for this item">
      No data
    </Badge>
  )
}
