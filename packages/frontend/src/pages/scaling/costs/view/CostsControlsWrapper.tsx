import React, { ReactNode } from 'react'

import { cn } from '../../../../utils/cn'

export function CostsControlsWrapper({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('group/costs-controls-wrapper', className)}
      data-role="costs-controls-wrapper"
      data-unit="USD"
      data-time-range="7D"
    >
      {children}
    </div>
  )
}
