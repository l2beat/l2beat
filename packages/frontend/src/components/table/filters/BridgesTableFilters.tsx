import cx from 'classnames'
import React from 'react'

import { IncludeArchivedCheckbox } from './checkboxes/IncludeArchivedCheckbox'
import { IncludeLayer2sCheckbox } from './checkboxes/IncludeLayer2sCheckbox'

export interface BridgesTableFiltersProps {
  className?: string
}

export function BridgesTableFilters({ className }: BridgesTableFiltersProps) {
  return (
    <div className={cx('overflow-x-auto whitespace-nowrap', className)}>
      <IncludeLayer2sCheckbox />
      <IncludeArchivedCheckbox className="ml-2" />
    </div>
  )
}
