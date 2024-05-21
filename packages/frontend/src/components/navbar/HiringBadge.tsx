import React from 'react'

import { Badge } from '../badge/Badge'

export function HiringBadge({ className }: { className?: string }) {
  return (
    <Badge type="purple" className={className}>
      We're hiring
    </Badge>
  )
}
