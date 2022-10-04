import { ProjectRiskViewEntry } from '@l2beat/config'
import classNames from 'classnames'
import React from 'react'

import { NoInfoCell } from './NoInfoCell'

interface Props {
  item?: ProjectRiskViewEntry
}

export function RiskCell({ item }: Props) {
  if (!item) {
    return <NoInfoCell />
  }
  return (
    <span
      className={classNames(
        'sm:text-sm md:text-base',
        item.sentiment && 'px-1 rounded-sm',
        'text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800',
        item.sentiment === 'bad' && 'text-white bg-red-100',
        item.sentiment === 'warning' && 'text-black bg-yellow-100',
        'Tooltip',
      )}
      title={item.description}
    >
      {item.value}
    </span>
  )
}
