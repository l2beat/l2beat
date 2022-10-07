import cx from 'classnames'
import React, { ReactNode } from 'react'

export interface NumberCellProps {
  signed?: boolean
  children: ReactNode
}

export function NumberCell(props: NumberCellProps) {
  const isPositive =
    props.signed &&
    typeof props.children === 'string' &&
    props.children.startsWith('+')

  const isNegative =
    props.signed &&
    typeof props.children === 'string' &&
    props.children.startsWith('-')

  return (
    <span
      className={cx(
        'text-base md:text-lg',
        isPositive && 'text-green-700 dark:text-green-300',
        isNegative && 'text-red-700 dark:text-red-300',
      )}
    >
      {props.children}
    </span>
  )
}
