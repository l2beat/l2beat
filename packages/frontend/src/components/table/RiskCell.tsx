import { ProjectRiskViewEntry } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { Badge } from '../badge/Badge'
import { UpcomingBadge } from '../badge/UpcomingBadge'
import { NoInfoCell } from './NoInfoCell'

interface Props {
  item?: ProjectRiskViewEntry
  isUpcoming?: boolean
}

export function RiskCell({ item }: Props) {
  if (!item) {
    return <NoInfoCell />
  }

  if (item.value === '' && item.description === 'No information available.') {
    return <UpcomingBadge />
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
          type={item.sentiment === 'bad' ? 'error' : 'warning'}
          title={item.description !== '' ? item.description : undefined}
          oneSize
        >
          {item.value}
        </Badge>
      )}
    </div>
  )
}
