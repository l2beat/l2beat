import { ProjectRiskViewEntry } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { Badge, BadgeType } from '../badge/Badge'
import { NoInfoCell } from './NoInfoCell'

interface Props {
  item?: ProjectRiskViewEntry
}

export function RiskCell({ item }: Props) {
  if (!item) {
    return <NoInfoCell />
  }

  return (
    <div
      className={cx(item.description !== '' && 'Tooltip')}
      title={item.description !== '' ? item.description : undefined}
    >
      {item.sentiment !== 'bad' && item.sentiment !== 'warning' ? (
        <span
          className={cx(item.description !== '' && 'Tooltip')}
          title={item.description !== '' ? item.description : undefined}
        >
          {item.value}
        </span>
      ) : (
        <Badge
          className={cx(item.description !== '' && 'Tooltip')}
          type={item.sentiment === 'bad' ? BadgeType.ERROR : BadgeType.WARNING}
          title={item.description !== '' ? item.description : undefined}
        >
          {item.value}
        </Badge>
      )}
    </div>
  )
}
