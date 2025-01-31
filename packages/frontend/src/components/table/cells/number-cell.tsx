import type { ReactNode } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { PercentChange } from '../../percent-change'

export interface NumberCellProps {
  signed?: boolean
  children: ReactNode
  className?: string
  tooltip?: string
}

export function NumberCell(props: NumberCellProps) {
  if (props.signed && typeof props.children === 'number') {
    return <PercentChange value={props.children} className={props.className} />
  }

  if (props.tooltip)
    return (
      <Tooltip>
        <TooltipTrigger className={props.className}>
          {props.children}
        </TooltipTrigger>
        <TooltipContent>{props.tooltip}</TooltipContent>
      </Tooltip>
    )

  return <div className={props.className}>{props.children}</div>
}
