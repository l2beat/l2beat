import cx from 'classnames'
import React, { ReactNode } from 'react'

interface GrayCellProps {
  title: string
  children: ReactNode
}

export function GrayCell(props: GrayCellProps) {
  return (
    <span
      className={cx(
        'px-1.5 py-px text-sm rounded',
        'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-800',
        'Tooltip',
      )}
      title={props.title}
    >
      {props.children}
    </span>
  )
}
