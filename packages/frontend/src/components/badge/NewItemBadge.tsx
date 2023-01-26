import React from 'react'

import { Badge } from './Badge'

export function NewItemBadge({ className }: { className?: string }) {
  return (
    <Badge type="brightYellow" className={className}>
      New
    </Badge>
  )
}
