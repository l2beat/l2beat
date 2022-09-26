import { ProjectRiskViewEntry } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

interface Props {
  item?: ProjectRiskViewEntry
}

export function RiskCell({ item }: Props) {
  if (!item) {
    return <span>-</span>
  }
  return (
    <span
      className={cx('RiskCell', item.sentiment, 'Tooltip')}
      title={item.description}
    >
      {item.value}
    </span>
  )
}
