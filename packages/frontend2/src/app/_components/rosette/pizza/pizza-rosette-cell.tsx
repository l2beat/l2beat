import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { type RosetteValue } from '../types'
import { PizzaRosetteIcon } from './pizza-rosette-icon'
import { PizzaRosetteTooltip } from './pizza-rosette-tooltip'

export interface PizzaRosetteCellProps {
  values: RosetteValue[]
  isUnderReview?: boolean
}

export function PizzaRosetteCell(props: PizzaRosetteCellProps) {
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger className="flex size-full items-center justify-center">
        <PizzaRosetteIcon
          values={props.values}
          className="size-6 md:size-8"
          isUnderReview={isUnderReview}
          background={false}
        />
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PizzaRosetteTooltip
          values={props.values}
          isUnderReview={isUnderReview}
        />
      </TooltipContent>
    </Tooltip>
  )
}
