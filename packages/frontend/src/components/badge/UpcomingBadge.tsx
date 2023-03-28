import cx from 'classnames'
import React from 'react'

import { Badge } from './Badge'

export interface UpcomingBadgeProps {
  isSmall?: boolean
  className?: string
}

export function UpcomingBadge(props: UpcomingBadgeProps) {
  return (
    <Badge
      className={cx(props.className)}
      type="gray"
      title={'The project is not yet deployed on Ethereum Mainnet'}
      oneSize
    >
      {props.isSmall ? '?' : 'Coming soon'}
    </Badge>
  )
}
