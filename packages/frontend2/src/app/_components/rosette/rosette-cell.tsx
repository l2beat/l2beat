import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'
import { SmallRosette } from './rosette'
import { RosetteTooltip } from './rosette-tooltip'
import { type RosetteValue } from './types'

export interface RosetteCellProps {
  values: RosetteValue[]
  isUpcoming?: boolean
  isUnderReview?: boolean
}

export function RosetteCell(props: RosetteCellProps) {
  const isUnderReview =
    props.isUnderReview ??
    props.values.every((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger>
        <SmallRosette
          values={props.values.map((value) => value.sentiment)}
          className="size-6 md:size-8"
          isUpcoming={props.isUpcoming}
          isUnderReview={isUnderReview}
        />
      </TooltipTrigger>
      <TooltipContent fitContent>
        <RosetteTooltip values={props.values} isUnderReview={isUnderReview} />
      </TooltipContent>
    </Tooltip>
  )
}
