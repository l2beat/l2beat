import React from 'react'

import { ValueWithDisplayValue } from '../pages/types'
import { getFirstTwoNonZeroPrecision } from '../utils/getFirstTwoNonZeroPrecision'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip/Tooltip'

interface Props {
  children: ValueWithDisplayValue
}

export function DetailedValueWithDisplayValue({ children }: Props) {
  if (!children.displayValue.startsWith('<')) {
    return children.displayValue
  }

  const precision = getFirstTwoNonZeroPrecision(children.value)

  return (
    <Tooltip>
      <TooltipTrigger>{children.displayValue}</TooltipTrigger>
      <TooltipContent>
        <span className="font-medium text-xs">
          {children.value.toFixed(precision)}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}
