import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/tooltip'
import type { RosetteValue } from '../types'
import { GrissiniIcon } from './grissini-icon'
import { GrissiniTooltip } from './grissini-tooltip'

export interface GrissiniCellProps {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  iconClassName?: string
  hasNoBridge?: boolean
}

export function GrissiniCell(props: GrissiniCellProps) {
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
        <GrissiniIcon
          values={props.values}
          hasNoBridge={props.hasNoBridge}
          className={cn('size-8 md:size-8', props.iconClassName)}
        />
      </TooltipTrigger>
      <TooltipContent fitContent>
        <GrissiniTooltip
          values={props.values}
          isUnderReview={isUnderReview}
          hasNoBridge={props.hasNoBridge}
        />
      </TooltipContent>
    </Tooltip>
  )
}
