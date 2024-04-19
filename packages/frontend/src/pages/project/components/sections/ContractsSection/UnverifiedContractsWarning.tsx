import React from 'react'

import { UnverifiedIcon } from '../../../../../components/icons/symbols/UnverifiedIcon'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../../../components/tooltip/Tooltip'
import { cn } from '../../../../../utils/cn'

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
