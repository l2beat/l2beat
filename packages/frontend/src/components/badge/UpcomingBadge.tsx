import cx from 'classnames'
import React from 'react'

import { Badge } from './Badge'

export interface UpcomingBadgeProps {
  isShort?: boolean
  className?: string
}

export function UpcomingBadge(props: UpcomingBadgeProps) {
  return (
    <Badge
      className={cx(props.className)}
      type="gray"
      title={'The data for this item is not available yet'}
      oneSize
    >
      {props.isShort ? '?' : 'Coming soon'}
    </Badge>
  )
}
