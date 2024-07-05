import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { SmallPizzaRosette } from './small-pizza-rosette'
import { PizzaRosetteTooltip } from './pizza-rosette-tooltip'
import { type RosetteValue } from '../types'

export interface PizzaRosetteCellProps {
  values: RosetteValue[]
  isUpcoming?: boolean
  isUnderReview?: boolean
}

export function PizzaRosetteCell(props: PizzaRosetteCellProps) {
  const isUnderReview =
    props.isUnderReview ??
    props.values.every((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center justify-center size-full">
        <SmallPizzaRosette
          values={props.values.map((value) => value.sentiment)}
          className="size-6 md:size-8"
          isUpcoming={props.isUpcoming}
          isUnderReview={isUnderReview}
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
