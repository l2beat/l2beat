import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import type { RosetteValue } from '../types'
import { PentagonRosetteIcon } from './pentagon-rosette-icon'
import { PentagonRosetteTooltip } from './pentagon-rosette-tooltip'

export interface PentagonRosetteCellProps {
  values: RosetteValue[]
  isUnderReview?: boolean
  hasNoBridge?: boolean
  className?: string
}

export function PentagonRosetteCell(props: PentagonRosetteCellProps) {
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'flex size-full items-center justify-center',
          props.className,
        )}
      >
        <PentagonRosetteIcon
          values={props.values}
          className="size-6 md:size-8"
          background={false}
          isUnderReview={isUnderReview}
          hasNoBridge={props.hasNoBridge}
        />
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PentagonRosetteTooltip
          values={props.values}
          isUnderReview={isUnderReview}
          hasNoBridge={props.hasNoBridge}
        />
      </TooltipContent>
    </Tooltip>
  )
}
