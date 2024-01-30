import React from 'react'

import { cn } from '../../utils/cn'
import { UnverifiedIcon } from '../icons/symbols/UnverifiedIcon'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface UnverifiedContractsWarningProps {
  tooltip: string
  className?: string
}

export function UnverifiedContractsWarning({
  className,
  tooltip,
}: UnverifiedContractsWarningProps) {
  return (
    <Tooltip className={cn('inline-block', className)}>
      <TooltipTrigger>
        <UnverifiedIcon className={cn('fill-red-300')} />
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
