import React from 'react'
import { Badge, BadgeSize, BadgeType } from '../Badge'

export function HiringBadge({ className }: { className?: string }) {
  return (
    <Badge type={BadgeType.PURPLE} size={BadgeSize.XS} className={className}>
      We're hiring
    </Badge>
  )
}
