import React from 'react'
import { Badge, BadgeSize, BadgeType } from '../badge/Badge'

export function HiringBadge({ className }: { className?: string }) {
  return (
    <Badge type={BadgeType.PURPLE} size={BadgeSize.SM} className={className}>
      <span className="md:hidden">We're hiring</span>
      <span className="hidden md:inline">Hiring</span>
    </Badge>
  )
}
