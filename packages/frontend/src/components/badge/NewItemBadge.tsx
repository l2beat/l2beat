import cx from 'classnames'
import React from 'react'

import { Badge } from './Badge'

export function NewItemBadge({ className }: { className?: string }) {
  return (
    <Badge
      type="brightYellow"
      className={cx('rounded-sm px-1 md:rounded md:px-1.5', className)}
    >
      New
    </Badge>
  )
}
