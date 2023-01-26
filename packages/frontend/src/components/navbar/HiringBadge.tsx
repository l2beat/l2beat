import React from 'react'

import { Badge } from '../badge/Badge'

export function HiringBadge({ className }: { className?: string }) {
  return (
    <Badge type="purple" className={className}>
      <span className="md:hidden">We're hiring</span>
      <span className="hidden md:inline">Hiring</span>
    </Badge>
  )
}
