import { Layer2RiskViewEntry } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

interface Props {
  item: Layer2RiskViewEntry
}

export function RiskCell({ item }: Props) {
  return (
    <span
      className={cx('RiskCell', item.sentiment, 'Tooltip')}
      title={item.description}
    >
      {item.value}
    </span>
  )
}
