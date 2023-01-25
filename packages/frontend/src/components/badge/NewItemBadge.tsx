import React from 'react'
import { Badge, BadgeType } from './Badge'

export function NewItemBadge({ className }: { className?: string }) {
  return (
    <Badge type={BadgeType.BRIGHT_YELLOW} className={className}>
      New
    </Badge>
  )
}
