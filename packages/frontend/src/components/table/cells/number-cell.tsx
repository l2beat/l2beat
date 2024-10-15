import { type ReactNode } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { cn } from '~/utils/cn'
import { PercentChange } from '../../percent-change'

export interface NumberCellProps {
  signed?: boolean
  children: ReactNode
  className?: string
  tooltip?: string
}

export function NumberCell(props: NumberCellProps) {
  const className = cn('text-xs md:text-base', props.className)

  if (props.signed && typeof props.children === 'number') {
    return <PercentChange value={props.children} className={className} />
  }

  if (props.tooltip)
    return (
      <Tooltip>
        <TooltipTrigger className={className}>{props.children}</TooltipTrigger>
        <TooltipContent>{props.tooltip}</TooltipContent>
      </Tooltip>
    )

  return <div className={className}>{props.children}</div>
}
