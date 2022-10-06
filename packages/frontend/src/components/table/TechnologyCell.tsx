import cx from 'classnames'
import React from 'react'

export interface TechnologyCellProps {
  children: string
}

export function TechnologyCell(props: TechnologyCellProps) {
  const isRollup = props.children.includes('Rollup')
  return (
    <span className={cx(isRollup && 'text-green-700 dark:text-green-300')}>
      {props.children}
    </span>
  )
}
