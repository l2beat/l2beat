import React, { ReactNode } from 'react'

import { cn } from '../../../../utils/cn'
import { SyncStatus } from '../../../types'

interface Props {
  children: ReactNode
  className?: string
  syncStatus?: SyncStatus
}

export function CostsControlsWrapper(props: Props) {
  return (
    <div
      className={cn(
        'group/costs-controls-wrapper',
        props.syncStatus?.isSynced === false && '*:!text-gray-500',
        props.className,
      )}
      data-role="costs-controls-wrapper"
      data-unit="USD"
      data-time-range="7D"
      data-type="TOTAL"
    >
      {props.children}
    </div>
  )
}
