import { ProjectRiskViewEntry } from '@l2beat/config'
import cx from 'classnames'
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
      className={cx(
        item.sentiment && 'px-1.5 py-px text-sm rounded',
        item.sentiment === 'bad' && 'text-white bg-red-500',
        item.sentiment === 'warning' && 'text-black bg-yellow-500',
        item.description !== '' && 'Tooltip',
      )}
      title={item.description !== '' ? item.description : undefined}
    >
      {item.value}
    </span>
  )
}
