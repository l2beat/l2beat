import React from 'react'
import { Badge, BadgeType } from '../Badge'

export function NoInfoCell() {
  return (
    <Badge type={BadgeType.GRAY} title="This item is still under review.">
      No info
    </Badge>
  )
}
