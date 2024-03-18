import React from 'react'

import { cn } from '../../utils/cn'
import { ShieldIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface UpdatedContractWarningProps {
  tooltip: string
  className?: string
}

export function UpdatedContractWarning({
  className,
  tooltip,
}: UpdatedContractWarningProps) {
  return (
    <Tooltip className={cn('inline-block', className)}>
      <TooltipTrigger>
        <ShieldIcon className={cn('fill-yellow-700 dark:fill-yellow-300')} />
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
