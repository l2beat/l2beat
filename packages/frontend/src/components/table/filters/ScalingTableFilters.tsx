import cx from 'classnames'
import React from 'react'

import { IncludeArchivedCheckbox } from './checkboxes/IncludeArchivedCheckbox'
import { IncludeUpcomingCheckbox } from './checkboxes/IncludeUpcomingCheckbox'

export interface ScalingTableFiltersProps {
  upcomingEnabled?: boolean
  className?: string
}

export function ScalingTableFilters({
  className,
  upcomingEnabled,
}: ScalingTableFiltersProps) {
  return (
    <div className={cx('overflow-x-auto whitespace-nowrap', className)}>
      {upcomingEnabled && <IncludeUpcomingCheckbox />}
      <IncludeArchivedCheckbox className={cx(upcomingEnabled ? 'ml-2' : '')} />
    </div>
  )
}
