import React from 'react'

import { ValueWithDisplayValue } from '../pages/types'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip/Tooltip'

interface Props {
  children: ValueWithDisplayValue
  precision?: number
}

export function DetailedValueWithDisplayValue({
  children,
  precision = 15,
}: Props) {
  if (!children.displayValue.startsWith('~')) {
    return children.displayValue
  }

  return (
    <Tooltip>
      <TooltipTrigger>{children.displayValue}</TooltipTrigger>
      <TooltipContent>
        <span className="text-xs font-medium">
          {children.value.toFixed(precision)}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}
