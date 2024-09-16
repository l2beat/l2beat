import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import { type RosetteValue } from '../types'
import { PentagonRosetteIcon } from './pentagon-rosette-icon'
import { PentagonRosetteTooltip } from './pentagon-rosette-tooltip'

export interface PentagonRosetteCellProps {
  values: RosetteValue[]
  isUnderReview?: boolean
}

export function PentagonRosetteCell(props: PentagonRosetteCellProps) {
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger className="flex size-full items-center justify-center">
        <PentagonRosetteIcon
          values={props.values}
          className="size-6 md:size-8"
          background={false}
        />
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PentagonRosetteTooltip
          values={props.values}
          isUnderReview={isUnderReview}
        />
      </TooltipContent>
    </Tooltip>
  )
}
