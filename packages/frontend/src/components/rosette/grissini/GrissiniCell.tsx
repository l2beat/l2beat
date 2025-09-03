import { TableLink } from '~/components/table/TableLink'
import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'
import type { RosetteValue } from '../types'
import { GrissiniIcon } from './GrissiniIcon'
import { GrissiniTooltip } from './GrissiniTooltip'

export interface GrissiniCellProps {
  values: RosetteValue[]
  isUnderReview?: boolean
  className?: string
  iconClassName?: string
  href?: string
  disabledOnMobile?: boolean
}

export function GrissiniCell(props: GrissiniCellProps) {
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(
          'flex h-[inherit] w-full items-center justify-center',
          props.className,
        )}
        disabledOnMobile={props.disabledOnMobile}
      >
        <TableLink href={props.href}>
          <GrissiniIcon
            values={props.values}
            className={cn('size-8 md:size-8', props.iconClassName)}
          />
        </TableLink>
      </TooltipTrigger>
      <TooltipContent fitContent>
        <GrissiniTooltip values={props.values} isUnderReview={isUnderReview} />
      </TooltipContent>
    </Tooltip>
  )
}
