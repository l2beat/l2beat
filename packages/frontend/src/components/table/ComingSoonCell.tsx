import React from 'react'
import { Badge, BadgeType } from '../Badge'

export function ComingSoonCell() {
  return (
    <Badge type={BadgeType.GRAY} title="This item will be added soon.">
      Coming soon
    </Badge>
  )
}
