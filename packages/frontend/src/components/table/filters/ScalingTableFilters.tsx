import cx from 'classnames'
import React from 'react'

import { IncludeArchivedCheckbox } from './checkboxes/IncludeArchivedCheckbox'
import { IncludeUpcomingCheckbox } from './checkboxes/IncludeUpcomingCheckbox'

export interface ScalingTableFiltersProps {
  className?: string
}

export function ScalingTableFilters({ className }: ScalingTableFiltersProps) {
  return (
    <div className={cx('overflow-x-auto whitespace-nowrap', className)}>
      <IncludeArchivedCheckbox />
      <IncludeUpcomingCheckbox className="ml-2" />
    </div>
  )
}
