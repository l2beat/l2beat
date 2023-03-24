import cx from 'classnames'
import React from 'react'

import { Checkbox } from '../../../Checkbox'

export interface IncludeUpcomingCheckboxProps {
  className?: string
}

export function IncludeUpcomingCheckbox({
  className,
}: IncludeUpcomingCheckboxProps) {
  return (
    <Checkbox
      className={cx(
        'bg-purple-100/70 text-white dark:bg-purple-100',
        className,
      )}
      role="table-upcoming"
      id="upcoming-rollups"
      label="Show upcoming rollups"
    />
  )
}
