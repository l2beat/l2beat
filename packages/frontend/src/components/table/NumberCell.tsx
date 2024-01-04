import cx from 'classnames'
import React, { ReactNode } from 'react'

import { PercentChange } from '../PercentChange'
import { Tooltip } from '../tooltip/Tooltip'

export interface NumberCellProps {
  signed?: boolean
  children: ReactNode
  className?: string
  tooltip?: string
}

export function NumberCell(props: NumberCellProps) {
  return (
    <Tooltip
      className={cx('text-base md:text-lg', props.className)}
      content={props.tooltip}
    >
      {props.signed && typeof props.children === 'string' ? (
        <PercentChange value={props.children} />
      ) : (
        props.children
      )}
    </Tooltip>
  )
}
