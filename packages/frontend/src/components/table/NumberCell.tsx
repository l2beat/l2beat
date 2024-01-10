import cx from 'classnames'
import React, { ReactNode } from 'react'

import { PercentChange } from '../PercentChange'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface NumberCellProps {
  signed?: boolean
  children: ReactNode
  className?: string
  tooltip?: string
}

export function NumberCell(props: NumberCellProps) {
  if (props.signed && typeof props.children === 'string') {
    return <PercentChange value={props.children} className={props.className} />
  }

  if (props.tooltip)
    return (
      <Tooltip className={cx('text-base md:text-lg', props.className)}>
        <TooltipTrigger>{props.children}</TooltipTrigger>
        <TooltipContent>{props.tooltip}</TooltipContent>
      </Tooltip>
    )

  return <div className={props.className}>{props.children}</div>
}
